import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  activatePaidPlan,
  computeAccessState,
  extendTrial,
  startTrial,
  type SubscriptionRecord,
} from './subscription-engine';

function daysAfter(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

test('startTrial gives a 3-month trial by default', () => {
  const createdAt = new Date('2026-01-15T00:00:00Z');
  const trial = startTrial(createdAt);
  assert.equal(trial.plan, 'trial');
  assert.equal(trial.trialEndsAt.toISOString(), '2026-04-15T00:00:00.000Z');
});

test('computeAccessState: within trial window allows access', () => {
  const createdAt = new Date('2026-01-01T00:00:00Z');
  const trial = startTrial(createdAt);
  const subscription: SubscriptionRecord = {
    ...trial,
    status: 'not_canceled',
    currentPeriodStart: null,
    currentPeriodEnd: null,
  };
  const now = daysAfter(createdAt, 10);
  const state = computeAccessState(subscription, now);
  assert.equal(state.status, 'trialing');
  assert.equal(state.canAccess, true);
  assert.ok(state.daysRemaining > 0);
});

test('computeAccessState: just past trial end but within grace still allows access', () => {
  const createdAt = new Date('2026-01-01T00:00:00Z');
  const trial = startTrial(createdAt);
  const subscription: SubscriptionRecord = {
    ...trial,
    status: 'not_canceled',
    currentPeriodStart: null,
    currentPeriodEnd: null,
  };
  const now = daysAfter(trial.trialEndsAt, 3);
  const state = computeAccessState(subscription, now);
  assert.equal(state.status, 'grace');
  assert.equal(state.canAccess, true);
});

test('computeAccessState: past grace period blocks access', () => {
  const createdAt = new Date('2026-01-01T00:00:00Z');
  const trial = startTrial(createdAt);
  const subscription: SubscriptionRecord = {
    ...trial,
    status: 'not_canceled',
    currentPeriodStart: null,
    currentPeriodEnd: null,
  };
  const now = daysAfter(trial.trialEndsAt, 30);
  const state = computeAccessState(subscription, now);
  assert.equal(state.status, 'expired');
  assert.equal(state.canAccess, false);
});

test('extendTrial pushes the effective trial end forward', () => {
  const createdAt = new Date('2026-01-01T00:00:00Z');
  const trial = startTrial(createdAt);
  const subscription: SubscriptionRecord = {
    ...trial,
    status: 'not_canceled',
    currentPeriodStart: null,
    currentPeriodEnd: null,
  };
  const newEnd = new Date('2026-12-31T00:00:00Z');
  const { extendedTrialUntil } = extendTrial(subscription, newEnd);
  const extended: SubscriptionRecord = { ...subscription, extendedTrialUntil };

  // Well past the original 3-month trial end, but before the extension.
  const now = new Date('2026-08-01T00:00:00Z');
  const state = computeAccessState(extended, now);
  assert.equal(state.status, 'trialing');
  assert.equal(state.canAccess, true);
});

test('extendTrial refuses to move the effective end backwards or not at all', () => {
  const createdAt = new Date('2026-01-01T00:00:00Z');
  const trial = startTrial(createdAt);
  const subscription: SubscriptionRecord = {
    ...trial,
    status: 'not_canceled',
    currentPeriodStart: null,
    currentPeriodEnd: null,
  };
  assert.throws(() => extendTrial(subscription, trial.trialEndsAt));
  assert.throws(() => extendTrial(subscription, daysAfter(trial.trialEndsAt, -10)));
});

test('activatePaidPlan sets a period matching the chosen plan length', () => {
  const from = new Date('2026-05-01T00:00:00Z');
  const activation = activatePaidPlan('plan_6mo', from);
  assert.equal(activation.plan, 'plan_6mo');
  assert.equal(activation.currentPeriodEnd.toISOString(), '2026-11-01T00:00:00.000Z');

  const subscription: SubscriptionRecord = {
    plan: activation.plan,
    status: 'not_canceled',
    trialStartedAt: from,
    trialEndsAt: from,
    extendedTrialUntil: null,
    currentPeriodStart: activation.currentPeriodStart,
    currentPeriodEnd: activation.currentPeriodEnd,
  };
  const state = computeAccessState(subscription, new Date('2026-08-01T00:00:00Z'));
  assert.equal(state.status, 'active');
  assert.equal(state.canAccess, true);
});

test('a canceled subscription never allows access, regardless of dates', () => {
  const from = new Date('2026-05-01T00:00:00Z');
  const activation = activatePaidPlan('plan_12mo', from);
  const subscription: SubscriptionRecord = {
    plan: activation.plan,
    status: 'canceled',
    trialStartedAt: from,
    trialEndsAt: from,
    extendedTrialUntil: null,
    currentPeriodStart: activation.currentPeriodStart,
    currentPeriodEnd: activation.currentPeriodEnd,
  };
  const state = computeAccessState(subscription, new Date('2026-06-01T00:00:00Z'));
  assert.equal(state.status, 'canceled');
  assert.equal(state.canAccess, false);
});

test('computeAccessState rejects a paid plan record missing currentPeriodEnd', () => {
  const from = new Date('2026-05-01T00:00:00Z');
  const subscription: SubscriptionRecord = {
    plan: 'plan_3mo',
    status: 'not_canceled',
    trialStartedAt: from,
    trialEndsAt: from,
    extendedTrialUntil: null,
    currentPeriodStart: from,
    currentPeriodEnd: null,
  };
  assert.throws(() => computeAccessState(subscription, from));
});
