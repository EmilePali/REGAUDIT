/**
 * RegAudit subscription / trial engine.
 *
 * Pure functions only - no DB, no I/O. Access state is always recomputed
 * from dates rather than trusted from a stored `status` flag, so the same
 * subscription record produces the same answer everywhere (reproducible,
 * like the simulation scoring engine). The one exception is `canceled`,
 * which is an explicit event a date comparison can't recover on its own.
 */

export type SubscriptionPlan = 'trial' | 'plan_3mo' | 'plan_6mo' | 'plan_12mo';
export type PaidPlan = Exclude<SubscriptionPlan, 'trial'>;

export type AccessStatus = 'trialing' | 'active' | 'grace' | 'expired' | 'canceled';

export const DEFAULT_TRIAL_MONTHS = 3;

export const PAID_PLAN_MONTHS: Record<PaidPlan, number> = {
  plan_3mo: 3,
  plan_6mo: 6,
  plan_12mo: 12,
};

/** Days of continued access after expiry before hard cut-off. */
export const DEFAULT_GRACE_PERIOD_DAYS = 7;

export interface SubscriptionRecord {
  plan: SubscriptionPlan;
  /** Only meaningful as an explicit 'canceled' flag - see file docblock. */
  status: 'canceled' | 'not_canceled';
  trialStartedAt: Date;
  trialEndsAt: Date;
  extendedTrialUntil: Date | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
}

export interface AccessState {
  status: AccessStatus;
  canAccess: boolean;
  /** The date access is being evaluated against (trial or paid period end). */
  effectiveUntil: Date;
  /** Whole days left before effectiveUntil; 0 once past it (still in grace). */
  daysRemaining: number;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date.getTime());
  result.setUTCMonth(result.getUTCMonth() + months);
  return result;
}

function daysBetween(from: Date, to: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.ceil((to.getTime() - from.getTime()) / msPerDay);
}

/** Provision a fresh trial, e.g. when a new regulator tenant is created. */
export function startTrial(
  tenantCreatedAt: Date,
  trialMonths: number = DEFAULT_TRIAL_MONTHS,
): Pick<
  SubscriptionRecord,
  'plan' | 'status' | 'trialStartedAt' | 'trialEndsAt' | 'extendedTrialUntil' | 'currentPeriodStart' | 'currentPeriodEnd'
> {
  return {
    plan: 'trial',
    status: 'not_canceled',
    trialStartedAt: tenantCreatedAt,
    trialEndsAt: addMonths(tenantCreatedAt, trialMonths),
    extendedTrialUntil: null,
    currentPeriodStart: null,
    currentPeriodEnd: null,
  };
}

function effectiveTrialEnd(subscription: SubscriptionRecord): Date {
  if (
    subscription.extendedTrialUntil &&
    subscription.extendedTrialUntil.getTime() > subscription.trialEndsAt.getTime()
  ) {
    return subscription.extendedTrialUntil;
  }
  return subscription.trialEndsAt;
}

/**
 * A super_admin extends a tenant's free period. `newTrialEnd` must move the
 * effective trial end forward - use this to grant extra free months, not to
 * shorten one.
 */
export function extendTrial(
  subscription: SubscriptionRecord,
  newTrialEnd: Date,
): Pick<SubscriptionRecord, 'extendedTrialUntil'> {
  if (newTrialEnd.getTime() <= effectiveTrialEnd(subscription).getTime()) {
    throw new Error(
      'newTrialEnd must be after the subscription\'s current effective trial end.',
    );
  }
  return { extendedTrialUntil: newTrialEnd };
}

/**
 * Activate one of the 3 paid plans (3/6/12 months), starting `from` (defaults
 * to now at the call site).
 */
export function activatePaidPlan(
  plan: PaidPlan,
  from: Date,
): { plan: PaidPlan; currentPeriodStart: Date; currentPeriodEnd: Date } {
  return {
    plan,
    currentPeriodStart: from,
    currentPeriodEnd: addMonths(from, PAID_PLAN_MONTHS[plan]),
  };
}

export function computeAccessState(
  subscription: SubscriptionRecord,
  now: Date = new Date(),
  graceDays: number = DEFAULT_GRACE_PERIOD_DAYS,
): AccessState {
  if (subscription.status === 'canceled') {
    return {
      status: 'canceled',
      canAccess: false,
      effectiveUntil: subscription.currentPeriodEnd ?? subscription.trialEndsAt,
      daysRemaining: 0,
    };
  }

  let effectiveUntil: Date;
  let activeStatusLabel: 'trialing' | 'active';

  if (subscription.plan === 'trial') {
    effectiveUntil = effectiveTrialEnd(subscription);
    activeStatusLabel = 'trialing';
  } else {
    if (!subscription.currentPeriodEnd) {
      throw new Error(
        `Subscription on paid plan "${subscription.plan}" is missing currentPeriodEnd.`,
      );
    }
    effectiveUntil = subscription.currentPeriodEnd;
    activeStatusLabel = 'active';
  }

  if (now.getTime() <= effectiveUntil.getTime()) {
    return {
      status: activeStatusLabel,
      canAccess: true,
      effectiveUntil,
      daysRemaining: daysBetween(now, effectiveUntil),
    };
  }

  const graceEndsAt = addMonths(effectiveUntil, 0);
  graceEndsAt.setUTCDate(graceEndsAt.getUTCDate() + graceDays);

  if (now.getTime() <= graceEndsAt.getTime()) {
    return {
      status: 'grace',
      canAccess: true,
      effectiveUntil,
      daysRemaining: 0,
    };
  }

  return {
    status: 'expired',
    canAccess: false,
    effectiveUntil,
    daysRemaining: 0,
  };
}
