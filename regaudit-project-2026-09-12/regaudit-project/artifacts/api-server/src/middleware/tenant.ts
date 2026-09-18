import type { NextFunction, Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db, tenants } from '@workspace/db';
import { parseSubdomainFromHost } from '@workspace/tenancy';
import { env } from '../env';

/**
 * Resolves the tenant from the request's Host header and attaches it to
 * `req.tenant`. Does NOT block the request when there's no tenant (root
 * domain, verify.*, api.* etc all legitimately have no tenant) - routes
 * that require one use `requireTenant` after this.
 */
export async function resolveTenant(req: Request, _res: Response, next: NextFunction) {
  const host = req.headers.host;
  if (!host) {
    next();
    return;
  }

  const subdomain = parseSubdomainFromHost(host, env.platformRootDomain);
  if (!subdomain) {
    next();
    return;
  }

  const [tenant] = await db
    .select()
    .from(tenants)
    .where(eq(tenants.subdomain, subdomain))
    .limit(1);

  if (tenant) {
    req.tenant = tenant;
  }

  next();
}

export function requireTenant(req: Request, res: Response, next: NextFunction) {
  if (!req.tenant) {
    res.status(404).json({
      error: 'unknown_tenant',
      message: 'This subdomain is not assigned to a regulator on this platform.',
    });
    return;
  }
  if (req.tenant.status === 'suspended') {
    res.status(403).json({
      error: 'tenant_suspended',
      message: 'This organization\'s access has been suspended.',
    });
    return;
  }
  next();
}
