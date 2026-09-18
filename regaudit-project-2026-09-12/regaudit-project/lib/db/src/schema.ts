import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

/**
 * Multi-tenant model.
 *
 * Hierarchy: platform (APEX SKY) -> tenant (a regulator, e.g. ARMP,
 * GCM) -> organization (an institution the regulator supervises) -> user.
 *
 * A tenant is what gets a subdomain and white-label branding
 * (armp.myplatform.com). Its subdomain is shared by the regulator and every
 * institution under it - institutions don't get their own subdomain, they
 * get scoped visibility inside their regulator's subdomain (see `role` on
 * `users`: an institution_admin only ever sees their own organizationId,
 * a regulator_admin sees every organization under their tenantId).
 */

export const tenantStatusEnum = pgEnum('tenant_status', [
  'active',
  'suspended',
]);

export const organizationStatusEnum = pgEnum('organization_status', [
  'active',
  'suspended',
]);

export const userRoleEnum = pgEnum('user_role', [
  // APEX SKY staff: full cross-tenant access. Not scoped to a tenant/org.
  'super_admin',
  // Regulator-side admin. Exactly 2 expected per tenant (enforced in the
  // application layer, not the schema - see lib/billing README note).
  'regulator_admin',
  // Institution-side admin. Exactly 2 expected per organization.
  'institution_admin',
  // Learner / trainee.
  'staff',
]);

export const userStatusEnum = pgEnum('user_status', [
  'active',
  'disabled',
]);

export const subscriptionPlanEnum = pgEnum('subscription_plan', [
  'trial',
  'plan_3mo',
  'plan_6mo',
  'plan_12mo',
]);

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'trialing',
  'active',
  'past_due',
  'expired',
  'canceled',
]);

export const paymentProviderEnum = pgEnum('payment_provider', [
  // An APEX SKY admin manually confirmed payment (bank transfer, cash,
  // invoice) - no online payment integration involved.
  'manual',
  // A West-Africa mobile money aggregator (e.g. CinetPay, PayDunya)
  // fronting Orange Money / MTN Money / Wave. See lib/billing for the
  // pluggable provider interface - the concrete aggregator is not wired
  // up yet, pending choice of vendor.
  'mobile_money_aggregator',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'succeeded',
  'failed',
  'refunded',
]);

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  /** Subdomain label only, e.g. "armp" for armp.myplatform.com. */
  subdomain: varchar('subdomain', { length: 63 }).notNull().unique(),
  logoUrl: text('logo_url'),
  brandColor: varchar('brand_color', { length: 7 }),
  contactEmail: varchar('contact_email', { length: 320 }),
  status: tenantStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const organizations = pgTable(
  'organizations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 200 }).notNull(),
    location: varchar('location', { length: 200 }),
    joinCode: varchar('join_code', { length: 16 }).notNull().unique(),
    status: organizationStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('organizations_tenant_id_idx').on(table.tenantId)],
);

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    displayName: varchar('display_name', { length: 200 }).notNull(),
    /** Store hashed/encrypted at the application layer, never plaintext. */
    phoneNumber: varchar('phone_number', { length: 32 }).notNull().unique(),
    role: userRoleEnum('role').notNull(),
    // Nullable: super_admin belongs to neither. regulator_admin has a
    // tenantId but no organizationId. institution_admin and staff have
    // both (organizationId implies tenantId, kept denormalized for
    // cheap tenant-scoped queries without a join).
    tenantId: uuid('tenant_id').references(() => tenants.id, {
      onDelete: 'cascade',
    }),
    organizationId: uuid('organization_id').references(
      () => organizations.id,
      { onDelete: 'cascade' },
    ),
    language: varchar('language', { length: 8 }).notNull().default('fr'),
    status: userStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastActiveAt: timestamp('last_active_at', { withTimezone: true }),
  },
  (table) => [
    index('users_tenant_id_idx').on(table.tenantId),
    index('users_organization_id_idx').on(table.organizationId),
  ],
);

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .unique()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  plan: subscriptionPlanEnum('plan').notNull().default('trial'),
  status: subscriptionStatusEnum('status').notNull().default('trialing'),
  trialStartedAt: timestamp('trial_started_at', {
    withTimezone: true,
  }).notNull(),
  /** Default trial end = trialStartedAt + 3 months, set at provisioning. */
  trialEndsAt: timestamp('trial_ends_at', { withTimezone: true }).notNull(),
  /**
   * Set by a super_admin to push the free period out further than the
   * default trialEndsAt. When present and later than trialEndsAt, this
   * wins - see lib/billing's computeSubscriptionStatus.
   */
  extendedTrialUntil: timestamp('extended_trial_until', {
    withTimezone: true,
  }),
  currentPeriodStart: timestamp('current_period_start', {
    withTimezone: true,
  }),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
  /** Short buffer after expiry before access is actually cut off. */
  graceEndsAt: timestamp('grace_ends_at', { withTimezone: true }),
  paymentProvider: paymentProviderEnum('payment_provider'),
  externalCustomerId: varchar('external_customer_id', { length: 200 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const planPricing = pgTable(
  'plan_pricing',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    plan: subscriptionPlanEnum('plan').notNull(),
    currency: varchar('currency', { length: 3 }).notNull().default('XOF'),
    /** Smallest currency unit. XOF has no minor unit, so this is whole francs. */
    amountMinor: integer('amount_minor').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [unique('plan_pricing_plan_currency_key').on(table.plan, table.currency)],
);

export const payments = pgTable(
  'payments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    subscriptionId: uuid('subscription_id')
      .notNull()
      .references(() => subscriptions.id, { onDelete: 'cascade' }),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    plan: subscriptionPlanEnum('plan').notNull(),
    provider: paymentProviderEnum('provider').notNull(),
    providerReference: varchar('provider_reference', { length: 200 }),
    amountMinor: integer('amount_minor').notNull(),
    currency: varchar('currency', { length: 3 }).notNull().default('XOF'),
    status: paymentStatusEnum('status').notNull().default('pending'),
    periodStart: timestamp('period_start', { withTimezone: true }).notNull(),
    periodEnd: timestamp('period_end', { withTimezone: true }).notNull(),
    /** Set when a super_admin manually confirms a 'manual' provider payment. */
    confirmedByUserId: uuid('confirmed_by_user_id').references(() => users.id),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('payments_tenant_id_idx').on(table.tenantId)],
);

export const certificates = pgTable(
  'certificates',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    courseVersion: varchar('course_version', { length: 50 }).notNull(),
    score: smallint('score').notNull(),
    level: varchar('level', { length: 50 }).notNull(),
    issuedAt: timestamp('issued_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    /**
     * Unguessable code embedded in the certificate's QR code. The QR always
     * points at OUR verification domain (see lib/tenancy), e.g.
     * https://verify.myplatform.com/c/{verificationCode} - never at the
     * tenant's subdomain. This is what turns every scan into a lead we see.
     */
    verificationCode: varchar('verification_code', { length: 32 })
      .notNull()
      .unique(),
    pdfUrl: text('pdf_url'),
  },
  (table) => [
    index('certificates_tenant_id_idx').on(table.tenantId),
    index('certificates_user_id_idx').on(table.userId),
  ],
);

export const certificateScans = pgTable(
  'certificate_scans',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    certificateId: uuid('certificate_id')
      .notNull()
      .references(() => certificates.id, { onDelete: 'cascade' }),
    scannedAt: timestamp('scanned_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    /** Hash the IP, never store it raw - see lib/tenancy's hashIpAddress. */
    ipHash: varchar('ip_hash', { length: 64 }),
    userAgent: text('user_agent'),
    approxCountry: varchar('approx_country', { length: 2 }),
    approxCity: varchar('approx_city', { length: 100 }),
    referrer: text('referrer'),
  },
  (table) => [index('certificate_scans_certificate_id_idx').on(table.certificateId)],
);

export const tenantsRelations = relations(tenants, ({ many, one }) => ({
  organizations: many(organizations),
  users: many(users),
  subscription: one(subscriptions, {
    fields: [tenants.id],
    references: [subscriptions.tenantId],
  }),
}));

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [organizations.tenantId],
    references: [tenants.id],
  }),
  users: many(users),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  certificates: many(certificates),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [subscriptions.tenantId],
    references: [tenants.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [payments.subscriptionId],
    references: [subscriptions.id],
  }),
  tenant: one(tenants, {
    fields: [payments.tenantId],
    references: [tenants.id],
  }),
}));

export const certificatesRelations = relations(certificates, ({ one, many }) => ({
  user: one(users, {
    fields: [certificates.userId],
    references: [users.id],
  }),
  tenant: one(tenants, {
    fields: [certificates.tenantId],
    references: [tenants.id],
  }),
  organization: one(organizations, {
    fields: [certificates.organizationId],
    references: [organizations.id],
  }),
  scans: many(certificateScans),
}));

export const certificateScansRelations = relations(certificateScans, ({ one }) => ({
  certificate: one(certificates, {
    fields: [certificateScans.certificateId],
    references: [certificates.id],
  }),
}));
