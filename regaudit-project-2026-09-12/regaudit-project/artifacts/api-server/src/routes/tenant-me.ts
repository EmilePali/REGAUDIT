import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { computeAccessState, type SubscriptionRecord } from '@workspace/billing';
import { db, subscriptions } from '@workspace/db';
import { requireTenant } from '../middleware/tenant';

export const tenantMeRouter = Router();

/**
 * "Who am I" for the branded frontend: resolved from the Host header by the
 * global `resolveTenant` middleware (see app.ts), not from a session - this
 * is what a regulator's subdomain calls to render its own branding and
 * trial/subscription status. Not super_admin-gated; there's no per-user
 * auth yet (see require-super-admin.ts), so this only ever reveals a
 * tenant's own public branding + access state, nothing sensitive.
 */
tenantMeRouter.get('/', requireTenant, async (req, res) => {
  const tenant = req.tenant!;

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.tenantId, tenant.id))
    .limit(1);

  const access = subscription
    ? computeAccessState({
        plan: subscription.plan,
        status: subscription.status === 'canceled' ? 'canceled' : 'not_canceled',
        trialStartedAt: subscription.trialStartedAt,
        trialEndsAt: subscription.trialEndsAt,
        extendedTrialUntil: subscription.extendedTrialUntil,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
      } satisfies SubscriptionRecord)
    : null;

  res.json({
    tenant: {
      id: tenant.id,
      name: tenant.name,
      subdomain: tenant.subdomain,
      logoUrl: tenant.logoUrl,
      brandColor: tenant.brandColor,
    },
    access,
  });
});
