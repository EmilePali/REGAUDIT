import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import { resolveTenant } from './middleware/tenant';
import { billingRouter } from './routes/billing';
import { leadsRouter } from './routes/leads';
import { tenantMeRouter } from './routes/tenant-me';
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
  app.use('/api/tenant/me', tenantMeRouter);

  // super_admin-only ops surfaces.
  app.use('/api/tenants', tenantsRouter);
  app.use('/api/leads', leadsRouter);

  // Express 5 forwards rejected promises from async handlers here automatically.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  });

  return app;
}
