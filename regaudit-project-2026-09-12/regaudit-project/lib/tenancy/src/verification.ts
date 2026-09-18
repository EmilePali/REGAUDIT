import { createHash, randomBytes } from 'node:crypto';

/**
 * Certificate verification codes and URLs.
 *
 * The critical product rule this file exists to enforce: every certificate
 * QR code resolves on OUR domain, never the tenant's subdomain. That's what
 * turns a scan by a trainee's boss into a lead we see, regardless of which
 * regulator issued the certificate. `buildVerificationUrl` takes no tenant
 * or subdomain argument at all, so a tenant-domain QR link can't be built
 * through this helper by accident.
 */

/** 20 URL-safe characters, ~120 bits of entropy - not guessable by scanning. */
export function generateVerificationCode(): string {
  return randomBytes(15).toString('base64url');
}

export function buildVerificationUrl(code: string, verificationDomain: string): string {
  return `https://${verificationDomain}/c/${code}`;
}

/**
 * Hash an IP address for `certificate_scans.ip_hash`. Raw IPs are never
 * stored - only enough to de-duplicate/rate-limit scans, per the
 * cahier des charges' data-minimization requirement (section 13.4).
 */
export function hashIpAddress(ip: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}
