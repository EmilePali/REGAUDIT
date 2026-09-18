function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is required but was not provided.`);
  }
  return value;
}

export const env = {
  get port(): number {
    return Number(requireEnv('PORT'));
  },
  /** e.g. "myplatform.com" - what tenant subdomains hang off of. */
  get platformRootDomain(): string {
    return requireEnv('PLATFORM_ROOT_DOMAIN');
  },
  /** e.g. "verify.myplatform.com" - where every certificate QR resolves. */
  get verificationDomain(): string {
    return requireEnv('VERIFICATION_DOMAIN');
  },
  /** Salt for hashing scanner IPs before they're stored - never log raw IPs. */
  get ipHashSalt(): string {
    return requireEnv('IP_HASH_SALT');
  },
  /**
   * Interim API key gating super_admin-only ops routes (tenant
   * provisioning, trial extension, leads). Replace with real phone+OTP
   * session auth (cahier des charges section 10.1) once that's built -
   * this is not a substitute for per-user authentication.
   */
  get superAdminApiKey(): string {
    return requireEnv('SUPER_ADMIN_API_KEY');
  },
};
