/**
 * Thin fetch wrapper for artifacts/api-server. No generated client exists
 * yet (see lib/api-zod, lib/api-client-react placeholders) - these types
 * are hand-written to match the API routes' JSON responses exactly and
 * will be replaced once Orval codegen is wired up.
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    super(`API request failed with status ${status}`);
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; adminKey?: string } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (options.adminKey) {
    headers['x-regaudit-admin-key'] = options.adminKey;
  }

  const response = await fetch(path, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const parsed = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(response.status, parsed);
  }

  return parsed as T;
}

export type TenantStatus = 'active' | 'suspended';
export type AccessStatus = 'trialing' | 'active' | 'grace' | 'expired' | 'canceled';

export interface TenantSummary {
  id: string;
  name: string;
  subdomain: string;
  logoUrl: string | null;
  brandColor: string | null;
  contactEmail: string | null;
  status: TenantStatus;
  createdAt: string;
}

export interface AccessState {
  status: AccessStatus;
  canAccess: boolean;
  effectiveUntil: string;
  daysRemaining: number;
}

export interface TenantListEntry {
  tenant: TenantSummary;
  subscription: { plan: string; status: string } | null;
  access: AccessState | null;
}

export interface CreateTenantInput {
  name: string;
  subdomain: string;
  contactEmail?: string;
  logoUrl?: string;
  brandColor?: string;
}

export const adminApi = {
  listTenants(adminKey: string) {
    return request<{ tenants: TenantListEntry[] }>('/api/tenants', { adminKey });
  },
  createTenant(input: CreateTenantInput, adminKey: string) {
    return request<{ tenant: TenantSummary; trialEndsAt: string }>('/api/tenants', {
      method: 'POST',
      body: input,
      adminKey,
    });
  },
};

export interface TenantMeResponse {
  tenant: Pick<TenantSummary, 'id' | 'name' | 'subdomain' | 'logoUrl' | 'brandColor'>;
  access: AccessState | null;
}

export function fetchTenantMe(): Promise<TenantMeResponse> {
  return request<TenantMeResponse>('/api/tenant/me');
}
