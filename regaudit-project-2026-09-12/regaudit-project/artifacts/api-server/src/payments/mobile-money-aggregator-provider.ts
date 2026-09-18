import type { CheckoutRequest, CheckoutResult, PaymentProvider, WebhookEvent } from './provider';

/**
 * West-Africa mobile money aggregator (Orange Money / MTN Money / Wave via
 * a gateway such as CinetPay or PayDunya). Not wired up yet - which
 * specific aggregator to integrate is an open business decision (API
 * keys, payout account, fee structure). This class exists so the rest of
 * the billing code (routes, tests) is written against the final shape and
 * doesn't need to change when a vendor is picked; only this file does.
 *
 * To finish this integration:
 * 1. Pick a vendor and get API credentials (checkout API key + webhook
 *    signing secret).
 * 2. Implement `createCheckout` to call their "create payment" endpoint
 *    and return the redirectUrl (or USSD prompt reference) they give back.
 * 3. Implement `parseWebhookEvent` to verify the webhook signature against
 *    the raw request body and map their payload to { providerReference,
 *    status }.
 */
export class MobileMoneyAggregatorProvider implements PaymentProvider {
  readonly name = 'mobile_money_aggregator' as const;

  async createCheckout(_request: CheckoutRequest): Promise<CheckoutResult> {
    throw new Error(
      'Mobile money aggregator not configured yet - no vendor (CinetPay/PayDunya/...) has been selected. Use the manual payment provider until this is wired up.',
    );
  }

  parseWebhookEvent(
    _rawBody: Buffer,
    _headers: Record<string, string | string[] | undefined>,
  ): WebhookEvent | null {
    throw new Error('Mobile money aggregator not configured yet.');
  }
}
