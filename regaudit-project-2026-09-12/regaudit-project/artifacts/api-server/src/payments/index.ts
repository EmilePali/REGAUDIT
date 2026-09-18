import type { PaymentProvider } from './provider';
import { ManualPaymentProvider } from './manual-provider';
import { MobileMoneyAggregatorProvider } from './mobile-money-aggregator-provider';

export type { CheckoutRequest, CheckoutResult, PaymentProvider, WebhookEvent } from './provider';

const providers: Record<PaymentProvider['name'], PaymentProvider> = {
  manual: new ManualPaymentProvider(),
  mobile_money_aggregator: new MobileMoneyAggregatorProvider(),
};

export function getPaymentProvider(name: PaymentProvider['name']): PaymentProvider {
  return providers[name];
}
