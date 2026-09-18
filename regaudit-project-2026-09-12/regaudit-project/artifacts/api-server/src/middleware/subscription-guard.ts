import type { NextFunction, Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { computeAccessState, type SubscriptionRecord } from '@workspace/billing';
import { db, subscriptions } from '@workspace/db';

/**
 * Blocks access to the app once a tenant's trial/paid period has lapsed
 * (past the grace window). Mount this after `requireTenant` on routes that
 * represent actual product usage - never on billing/checkout routes
 * themselves, or an expired tenant could never pay to get unblocked.
 */
export async function requireActiveSubscription(req: Request, res: Response, next: NextFunction) {
  const tenant = req.tenant;
  if (!tenant) {
    res.status(404).json({ error: 'unknown_tenant' });
    return;
  }

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.tenantId, tenant.id))
    .limit(1);

  if (!subscription) {
    res.status(402).json({
      error: 'no_subscription',
      message: 'No subscription found for this organization.',
    });
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

  const access = computeAccessState(record);
  req.subscriptionAccess = access;

  if (!access.canAccess) {
    res.status(402).json({
      error: 'subscription_expired',
      message: 'This organization\'s free period or subscription has ended.',
      effectiveUntil: access.effectiveUntil.toISOString(),
    });
    return;
  }

  next();
}
