import { Router } from 'express';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { computeAccessState, startTrial, extendTrial, type SubscriptionRecord } from '@workspace/billing';
import { assertProvisionableSubdomain } from '@workspace/tenancy';
import { db, subscriptions, tenants } from '@workspace/db';
import { requireSuperAdmin } from '../middleware/require-super-admin';

export const tenantsRouter = Router();

tenantsRouter.use(requireSuperAdmin);

/** List every provisioned tenant with its current access state, for the APEX SKY admin console. */
tenantsRouter.get('/', async (_req, res) => {
  const rows = await db
    .select({ tenant: tenants, subscription: subscriptions })
    .from(tenants)
    .leftJoin(subscriptions, eq(subscriptions.tenantId, tenants.id))
    .orderBy(tenants.createdAt);

  const withAccess = rows.map(({ tenant, subscription }) => {
    if (!subscription) {
      return { tenant, subscription: null, access: null };
    }
    const record: SubscriptionRecord = {
      plan: subscription.plan,
      status: subscription.status === 'canceled' ? 'canceled' : 'not_canceled',
      trialStartedAt: subscription.trialStartedAt,
      trialEndsAt: subscription.trialEndsAt,
      extendedTrialUntil: subscription.extendedTrialUntil,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
    };
    return { tenant, subscription, access: computeAccessState(record) };
  });

  res.json({ tenants: withAccess });
});

const createTenantSchema = z.object({
  name: z.string().min(2).max(200),
  subdomain: z.string().min(2).max(63),
  contactEmail: z.string().email().optional(),
  logoUrl: z.string().url().optional(),
  brandColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
});

/** Provision a new regulator tenant. Automatically starts its 3-month free trial. */
tenantsRouter.post('/', async (req, res) => {
  const parsed = createTenantSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_body', issues: parsed.error.issues });
    return;
  }

  const subdomain = parsed.data.subdomain.toLowerCase();
  try {
    assertProvisionableSubdomain(subdomain);
  } catch (error) {
    res.status(400).json({ error: 'invalid_subdomain', message: (error as Error).message });
    return;
  }

  const now = new Date();

  const [tenant] = await db
    .insert(tenants)
    .values({
      name: parsed.data.name,
      subdomain,
      contactEmail: parsed.data.contactEmail,
      logoUrl: parsed.data.logoUrl,
      brandColor: parsed.data.brandColor,
    })
    .returning();

  if (!tenant) {
    res.status(500).json({ error: 'tenant_creation_failed' });
    return;
  }

  const trial = startTrial(now);
  await db.insert(subscriptions).values({
    tenantId: tenant.id,
    plan: trial.plan,
    status: 'trialing',
    trialStartedAt: trial.trialStartedAt,
    trialEndsAt: trial.trialEndsAt,
    extendedTrialUntil: trial.extendedTrialUntil,
    currentPeriodStart: trial.currentPeriodStart,
    currentPeriodEnd: trial.currentPeriodEnd,
  });

  res.status(201).json({ tenant, trialEndsAt: trial.trialEndsAt });
});

const extendTrialSchema = z.object({
  newTrialEnd: z.coerce.date(),
});

/** Push a tenant's free period out further than its current trial end. */
tenantsRouter.post('/:tenantId/trial/extend', async (req, res) => {
  const parsed = extendTrialSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_body', issues: parsed.error.issues });
    return;
  }

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.tenantId, req.params.tenantId as string))
    .limit(1);

  if (!subscription) {
    res.status(404).json({ error: 'subscription_not_found' });
    return;
  }

  const record: SubscriptionRecord = {
    plan: subscription.plan,
    status: subscription.status === 'canceled' ? 'canceled' : 'not_canceled',
    trialStartedAt: subscription.trialStartedAt,
    trialEndsAt: subscription.trialEndsAt,
    extendedTrialUntil: subscription.extendedTrialUntil,
    currentPeriodStart: subscription.currentPeriodStart,
    currentPeriodEnd: subscription.currentPeriodEnd,
  };

  try {
    const { extendedTrialUntil } = extendTrial(record, parsed.data.newTrialEnd);
    await db
      .update(subscriptions)
      .set({ extendedTrialUntil, updatedAt: new Date() })
      .where(eq(subscriptions.id, subscription.id));
    res.json({ extendedTrialUntil });
  } catch (error) {
    res.status(400).json({ error: 'invalid_extension', message: (error as Error).message });
  }
});
