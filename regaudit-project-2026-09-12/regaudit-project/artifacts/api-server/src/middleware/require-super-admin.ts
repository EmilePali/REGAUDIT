import type { NextFunction, Request, Response } from 'express';
import { env } from '../env';

/**
 * Interim gate for APEX SKY-only ops endpoints (tenant provisioning, trial
 * extension, leads reporting). Compares a shared API key rather than a real
 * per-user session, because phone+OTP auth and role-based sessions
 * (cahier des charges section 10.1 / 4.2) aren't built yet. Swap this for
 * a `req.user.role === 'super_admin'` check once that lands - do not build
 * more ops routes on top of the API key long-term.
 */
export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  const providedKey = req.header('x-regaudit-admin-key');
  if (!providedKey || providedKey !== env.superAdminApiKey) {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  next();
}
