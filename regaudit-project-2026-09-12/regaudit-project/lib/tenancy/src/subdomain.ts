/**
 * Subdomain resolution and validation for the white-label multi-tenant
 * platform. A regulator's subdomain (e.g. "armp" for armp.myplatform.com)
 * is how its own staff and institutions reach their branded instance; the
 * root domain and reserved subdomains are the platform itself.
 */

export const RESERVED_SUBDOMAINS = new Set([
  'www',
  'api',
  'app',
  'verify',
  'admin',
  'mail',
  'ftp',
  'cdn',
  'static',
  'assets',
  'staging',
  'dev',
  'test',
  'support',
  'help',
  'billing',
  'docs',
  'status',
]);

const SUBDOMAIN_FORMAT = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export function isValidSubdomainFormat(subdomain: string): boolean {
  return (
    subdomain.length >= 2 &&
    subdomain.length <= 63 &&
    SUBDOMAIN_FORMAT.test(subdomain) &&
    !RESERVED_SUBDOMAINS.has(subdomain)
  );
}

/**
 * Throws with a caller-facing reason if `subdomain` can't be assigned to a
 * new tenant. Use before provisioning, not on every request (see
 * `parseSubdomainFromHost` for the hot path).
 */
export function assertProvisionableSubdomain(subdomain: string): void {
  if (subdomain.length < 2 || subdomain.length > 63) {
    throw new Error('Le sous-domaine doit contenir entre 2 et 63 caractères.');
  }
  if (!SUBDOMAIN_FORMAT.test(subdomain)) {
    throw new Error(
      'Le sous-domaine ne peut contenir que des lettres minuscules, chiffres et tirets, sans tiret au début ou à la fin.',
    );
  }
  if (RESERVED_SUBDOMAINS.has(subdomain)) {
    throw new Error(`"${subdomain}" est un sous-domaine réservé à la plateforme.`);
  }
}

/**
 * Extracts the tenant subdomain label from an incoming Host header, given
 * the platform's own root domain (e.g. "myplatform.com"). Returns null for
 * the root domain itself, an unrelated domain, or a reserved subdomain
 * (www, api, verify, ...) - callers treat null as "not a tenant, this is
 * the platform/marketing site or an API/verification host."
 */
export function parseSubdomainFromHost(
  host: string,
  platformRootDomain: string,
): string | null {
  const hostname = host.split(':')[0]!.toLowerCase();
  const rootDomain = platformRootDomain.toLowerCase();

  if (hostname === rootDomain) {
    return null;
  }

  const suffix = `.${rootDomain}`;
  if (!hostname.endsWith(suffix)) {
    return null;
  }

  const label = hostname.slice(0, -suffix.length);
  if (label.length === 0 || label.includes('.') || RESERVED_SUBDOMAINS.has(label)) {
    return null;
  }

  return label;
}
