import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { hashIpAddress } from '@workspace/tenancy';
import { certificateScans, certificates, db, organizations, tenants, users } from '@workspace/db';
import { env } from '../env';

export const verifyRouter = Router();

/**
 * Public certificate verification. Always served on the platform's own
 * verify.* domain (never a tenant subdomain - see lib/tenancy's
 * buildVerificationUrl). Passive lead capture: the result is shown
 * immediately, no form required, and the scan itself is logged as a lead
 * event (see certificate_scans) rather than gating the page behind one.
 */
verifyRouter.get('/c/:code', async (req, res) => {
  const code = req.params.code as string;

  const [row] = await db
    .select({
      certificateId: certificates.id,
      score: certificates.score,
      level: certificates.level,
      courseVersion: certificates.courseVersion,
      issuedAt: certificates.issuedAt,
      traineeName: users.displayName,
      organizationName: organizations.name,
      tenantName: tenants.name,
      tenantLogoUrl: tenants.logoUrl,
      tenantBrandColor: tenants.brandColor,
    })
    .from(certificates)
    .innerJoin(users, eq(certificates.userId, users.id))
    .innerJoin(organizations, eq(certificates.organizationId, organizations.id))
    .innerJoin(tenants, eq(certificates.tenantId, tenants.id))
    .where(eq(certificates.verificationCode, code))
    .limit(1);

  if (!row) {
    // Same response whether the code is malformed or simply doesn't exist,
    // so a scanner can't distinguish the two.
    res.status(404).json({ error: 'certificate_not_found' });
    return;
  }

  const rawIp = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  await db.insert(certificateScans).values({
    certificateId: row.certificateId,
    ipHash: hashIpAddress(rawIp, env.ipHashSalt),
    userAgent: req.header('user-agent') ?? null,
    referrer: req.header('referer') ?? null,
  });

  res.json({
    trainee: row.traineeName,
    organization: row.organizationName,
    course: row.courseVersion,
    score: row.score,
    level: row.level,
    issuedAt: row.issuedAt,
    issuedVia: {
      name: row.tenantName,
      logoUrl: row.tenantLogoUrl,
      brandColor: row.tenantBrandColor,
    },
    platform: {
      name: 'RegAudit',
      operator: 'APEX SKY',
      disclaimer:
        "Attestation de formation RegAudit délivrée via la plateforme d'APEX SKY - ce n'est pas une certification officielle de l'AIRMS.",
    },
  });
});
