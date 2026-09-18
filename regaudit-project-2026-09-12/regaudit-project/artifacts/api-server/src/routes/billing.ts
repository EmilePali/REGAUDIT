import { Router } from 'express';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { activatePaidPlan, type PaidPlan, type SubscriptionPlan } from '@workspace/billing';
import { db, payments, planPricing, subscriptions } from '@workspace/db';
import { requireTenant, resolveTenant } from '../middleware/tenant';
import { requireSuperAdmin } from '../middleware/require-super-admin';
import { getPaymentProvider } from '../payments';

export const billingRouter = Router();

/**
 * Public plan catalog. Intentionally NOT behind requireActiveSubscription -
 * a tenant whose trial or subscription has lapsed still needs to see this
 * to pay.
 */
billingRouter.get('/plans', async (_req, res) => {
  const plans = await db.select().from(planPricing).where(eq(planPricing.isActive, true));
  res.json({ plans });
});

const checkoutSchema = z.object({
  plan: z.enum(['plan_3mo', 'plan_6mo', 'plan_12mo']),
  provider: z.enum(['manual', 'mobile_money_aggregator']),
  currency: z.string().length(3).default('XOF'),
});

/** Start a checkout for the current tenant (resolved from the Host header). */
billingRouter.post('/checkout', resolveTenant, requireTenant, async (req, res) => {
  const tenant = req.tenant!;
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'invalid_body', issues: parsed.error.issues });
    return;
  }

  const plan = parsed.data.plan as PaidPlan;

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.tenantId, tenant.id))
    .limit(1);
  if (!subscription) {
    res.status(404).json({ error: 'subscription_not_found' });
    return;
  }

  const [pricing] = await db
    .select()
    .from(planPricing)
    .where(
      and(
        eq(planPricing.plan, plan),
        eq(planPricing.currency, parsed.data.currency),
        eq(planPricing.isActive, true),
      ),
    )
    .limit(1);
  if (!pricing) {
    res.status(400).json({ error: 'no_pricing_for_plan_currency' });
    return;
  }

  const provider = getPaymentProvider(parsed.data.provider);
  const now = new Date();
  const activation = activatePaidPlan(plan, now);

  const checkout = await provider.createCheckout({
    tenantId: tenant.id,
    plan,
    amountMinor: pricing.amountMinor,
    currency: pricing.currency,
  });

  const [payment] = await db
    .insert(payments)
    .values({
      subscriptionId: subscription.id,
      tenantId: tenant.id,
      plan,
      provider: provider.name,
      providerReference: checkout.providerReference,
      amountMinor: pricing.amountMinor,
      currency: pricing.currency,
      status: 'pending',
      periodStart: activation.currentPeriodStart,
      periodEnd: activation.currentPeriodEnd,
    })
    .returning();

  res.status(201).json({
    payment,
    redirectUrl: checkout.redirectUrl,
    instructions: checkout.instructions,
  });
});

/** APEX SKY admin manually confirms a 'manual' provider payment. */
billingRouter.post('/payments/:paymentId/confirm', requireSuperAdmin, async (req, res) => {
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, req.params.paymentId as string))
    .limit(1);

  if (!payment) {
    res.status(404).json({ error: 'payment_not_found' });
    return;
  }
  if (payment.provider !== 'manual') {
    res.status(400).json({
      error: 'not_a_manual_payment',
      message: 'Only manual-provider payments are confirmed through this endpoint.',
    });
    return;
  }
  if (payment.status === 'succeeded') {
    res.json({ payment });
    return;
  }

  await applySuccessfulPayment(payment.id, payment.subscriptionId, payment.plan, payment.periodStart, payment.periodEnd);
  res.json({ status: 'succeeded' });
});

/**
 * Mobile money aggregator webhook. Kept separate from JSON body parsing at
 * the app level (see app.ts) because signature verification needs the raw
 * request bytes.
 */
billingRouter.post('/webhook/mobile-money-aggregator', async (req, res) => {
  const provider = getPaymentProvider('mobile_money_aggregator');
  let event;
  try {
    event = provider.parseWebhookEvent(req.body as Buffer, req.headers);
  } catch {
    res.status(503).json({ error: 'provider_not_configured' });
    return;
  }
  if (!event) {
    res.status(400).json({ error: 'invalid_webhook_payload' });
    return;
  }

  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.providerReference, event.providerReference))
    .limit(1);

  if (!payment) {
    res.status(404).json({ error: 'payment_not_found' });
    return;
  }

  if (event.status === 'succeeded' && payment.status !== 'succeeded') {
    await applySuccessfulPayment(payment.id, payment.subscriptionId, payment.plan, payment.periodStart, payment.periodEnd);
  } else if (event.status === 'failed') {
    await db.update(payments).set({ status: 'failed' }).where(eq(payments.id, payment.id));
  }

  res.json({ received: true });
});

async function applySuccessfulPayment(
  paymentId: string,
  subscriptionId: string,
  plan: SubscriptionPlan,
  periodStart: Date,
  periodEnd: Date,
) {
  await db
    .update(payments)
    .set({ status: 'succeeded', confirmedAt: new Date() })
    .where(eq(payments.id, paymentId));

  await db
    .update(subscriptions)
    .set({
      plan,
      status: 'active',
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, subscriptionId));
}
