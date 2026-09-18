import express, { type Express } from 'express';
import { resolveTenant } from './middleware/tenant';
import { billingRouter } from './routes/billing';
import { leadsRouter } from './routes/leads';
import { tenantsRouter } from './routes/tenants';
import { verifyRouter } from './routes/verify';

export function createApp(): Express {
  const app = express();

  // The mobile money webhook needs the raw body to verify its signature,
  // so it's mounted with express.raw() before the JSON parser applies.
  app.use('/api/billing/webhook', express.raw({ type: '*/*' }));
  app.use(express.json());

  app.use(resolveTenant);

  app.get('/healthz', (_req, res) => {
    res.json({ ok: true });
  });

  // Public - no tenant/subscription gate.
  app.use('/c', verifyRouter);
  app.use('/api/billing', billingRouter);

  // super_admin-only ops surfaces.
  app.use('/api/tenants', tenantsRouter);
  app.use('/api/leads', leadsRouter);

  return app;
}
