import { Router } from 'express';
import { count, desc, eq } from 'drizzle-orm';
import { certificateScans, certificates, db, tenants } from '@workspace/db';
import { requireSuperAdmin } from '../middleware/require-super-admin';

export const leadsRouter = Router();

leadsRouter.use(requireSuperAdmin);

/**
 * The "Contact-to-Revenue" reporting surface: how many people scanned a
 * RegAudit certificate, broken down by which regulator's certificate it
 * was - the count that proves the QR-on-our-domain strategy is generating
 * leads, per tenant.
 */
leadsRouter.get('/', async (_req, res) => {
  const scansByTenant = await db
    .select({
      tenantId: tenants.id,
      tenantName: tenants.name,
      tenantSubdomain: tenants.subdomain,
      scanCount: count(certificateScans.id),
    })
    .from(certificateScans)
    .innerJoin(certificates, eq(certificateScans.certificateId, certificates.id))
    .innerJoin(tenants, eq(certificates.tenantId, tenants.id))
    .groupBy(tenants.id, tenants.name, tenants.subdomain)
    .orderBy(desc(count(certificateScans.id)));

  const recentScans = await db
    .select({
      scannedAt: certificateScans.scannedAt,
      tenantName: tenants.name,
      referrer: certificateScans.referrer,
      userAgent: certificateScans.userAgent,
    })
    .from(certificateScans)
    .innerJoin(certificates, eq(certificateScans.certificateId, certificates.id))
    .innerJoin(tenants, eq(certificates.tenantId, tenants.id))
    .orderBy(desc(certificateScans.scannedAt))
    .limit(50);

  res.json({ scansByTenant, recentScans });
});
