import type { CheckoutRequest, CheckoutResult, PaymentProvider, WebhookEvent } from './provider';

/**
 * No online payment integration - an APEX SKY admin confirms payment
 * (bank transfer, cash, invoice) themselves via
 * `POST /api/billing/payments/:id/confirm`. `createCheckout` just records
 * the pending payment and hands back instructions; there's no webhook path
 * for this provider, so `parseWebhookEvent` always returns null.
 */
export class ManualPaymentProvider implements PaymentProvider {
  readonly name = 'manual' as const;

  async createCheckout(request: CheckoutRequest): Promise<CheckoutResult> {
    return {
      redirectUrl: null,
      providerReference: null,
      instructions: `Réglez ${request.amountMinor.toLocaleString('fr-FR')} ${request.currency} par virement ou en espèces auprès d'APEX SKY, puis un administrateur confirmera le paiement dans le back-office.`,
    };
  }

  parseWebhookEvent(): WebhookEvent | null {
    return null;
  }
}
