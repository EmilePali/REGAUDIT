import type { PaidPlan } from '@workspace/billing';

export interface CheckoutRequest {
  tenantId: string;
  plan: PaidPlan;
  amountMinor: number;
  currency: string;
}

export interface CheckoutResult {
  /** null when there's nothing for the payer to be redirected to (e.g. manual). */
  redirectUrl: string | null;
  /** Provider-side reference to reconcile against a later webhook, if any. */
  providerReference: string | null;
  instructions: string;
}

export interface WebhookEvent {
  providerReference: string;
  status: 'succeeded' | 'failed';
}

export interface PaymentProvider {
  readonly name: 'manual' | 'mobile_money_aggregator';
  createCheckout(request: CheckoutRequest): Promise<CheckoutResult>;
  /** Returns null if the payload doesn't verify (bad signature, unknown shape). */
  parseWebhookEvent(rawBody: Buffer, headers: Record<string, string | string[] | undefined>): WebhookEvent | null;
}
