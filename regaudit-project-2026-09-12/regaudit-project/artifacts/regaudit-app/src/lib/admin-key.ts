const STORAGE_KEY = 'regaudit.adminKey';

/**
 * Interim super_admin credential, kept only in this tab's sessionStorage.
 * Mirrors the server's interim x-regaudit-admin-key gate (see
 * artifacts/api-server/src/middleware/require-super-admin.ts) - replace
 * both once real phone+OTP auth exists.
 */
export function getAdminKey(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAdminKey(key: string): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, key);
  } catch {
    // sessionStorage unavailable (private browsing, etc.) - the key just
    // won't persist across reloads; callers re-prompt in that case.
  }
}

export function clearAdminKey(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clean up if storage was never reachable.
  }
}
