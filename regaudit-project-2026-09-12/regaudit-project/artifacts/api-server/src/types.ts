import type { AccessState } from '@workspace/billing';
import type { tenants } from '@workspace/db';

export type Tenant = typeof tenants.$inferSelect;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Set by requireTenant/resolveTenant when the Host header maps to a tenant. */
      tenant?: Tenant;
      /** Set by requireActiveSubscription after computing the tenant's access state. */
      subscriptionAccess?: AccessState;
    }
  }
}

export {};
