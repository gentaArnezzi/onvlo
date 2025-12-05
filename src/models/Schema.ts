import {
  bigint,
  boolean,
  integer,
  jsonb,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the next database interaction,
// so there's no need to run it manually or restart the Next.js server.

// Need a database for production? Check out https://www.prisma.io/?via=saasboilerplatesrc
// Tested and compatible with Next.js Boilerplate
export const organizationSchema = pgTable(
  'organization',
  {
    id: text('id').primaryKey(),
    name: text('name'),
    slug: text('slug'),
    logo: text('logo'),
    brandColor: text('brand_color'),
    timezone: text('timezone').default('UTC').notNull(),
    defaultCurrency: text('default_currency').default('USD').notNull(),
    defaultInvoiceTerms: text('default_invoice_terms').default('Net 30').notNull(),
    stripeCustomerId: text('stripe_customer_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    stripeSubscriptionPriceId: text('stripe_subscription_price_id'),
    stripeSubscriptionStatus: text('stripe_subscription_status'),
    stripeSubscriptionCurrentPeriodEnd: bigint(
      'stripe_subscription_current_period_end',
      { mode: 'number' },
    ),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      stripeCustomerIdIdx: uniqueIndex('stripe_customer_id_idx').on(
        table.stripeCustomerId,
      ),
      slugIdx: uniqueIndex('organization_slug_idx').on(table.slug),
    };
  },
);

export const todoSchema = pgTable('todo', {
  id: serial('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Clients schema
export const clientsSchema = pgTable('clients', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id').notNull(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  company: text('company'),
  stripeCustomerId: text('stripe_customer_id'),
  status: text('status').default('active').notNull(), // active, inactive, archived
  notes: text('notes'),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Leads schema
export const leadsSchema = pgTable('leads', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id').notNull(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  company: text('company'),
  source: text('source'), // website, referral, social, etc.
  stage: text('stage').default('New').notNull(), // New, Qualified, Proposal Sent, Won, Lost
  tags: text('tags'), // comma-separated or JSON
  notes: text('notes'),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Projects schema
export const projectsSchema = pgTable('projects', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id').notNull(),
  clientId: integer('client_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').default('Planned').notNull(), // Planned, Active, On Hold, Completed, Cancelled
  startDate: timestamp('start_date', { mode: 'date' }),
  endDate: timestamp('end_date', { mode: 'date' }),
  budget: real('budget'),
  ownerId: text('owner_id'), // Clerk user ID
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Tasks schema
export const tasksSchema = pgTable('tasks', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  assigneeId: text('assignee_id'), // Clerk user ID
  status: text('status').default('Backlog').notNull(), // Backlog, In Progress, Review, Done
  priority: text('priority').default('Medium'), // Low, Medium, High, Urgent
  dueDate: timestamp('due_date', { mode: 'date' }),
  visibleToClient: boolean('visible_to_client').default(false).notNull(),
  labels: text('labels'), // comma-separated or JSON
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Invoices schema
export const invoicesSchema = pgTable('invoices', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id').notNull(),
  clientId: integer('client_id').notNull(),
  projectId: integer('project_id'), // optional
  invoiceNumber: text('invoice_number').notNull(),
  status: text('status').default('Draft').notNull(), // Draft, Sent, Paid, Overdue
  dueDate: timestamp('due_date', { mode: 'date' }).notNull(),
  subtotal: real('subtotal').default(0).notNull(),
  tax: real('tax').default(0).notNull(),
  taxRate: real('tax_rate').default(0).notNull(), // percentage
  total: real('total').default(0).notNull(),
  notes: text('notes'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  paidAt: timestamp('paid_at', { mode: 'date' }),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Invoice Items schema
export const invoiceItemsSchema = pgTable('invoice_items', {
  id: serial('id').primaryKey(),
  invoiceId: integer('invoice_id').notNull(),
  description: text('description').notNull(),
  quantity: real('quantity').default(1).notNull(),
  unitPrice: real('unit_price').notNull(),
  total: real('total').notNull(), // quantity * unitPrice
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Onboarding Funnels schema
export const onboardingFunnelsSchema = pgTable('onboarding_funnels', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id').notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  config: jsonb('config'), // JSON: formFields, agreementTemplate, packageOptions, etc.
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Onboarding Submissions schema
export const onboardingSubmissionsSchema = pgTable('onboarding_submissions', {
  id: serial('id').primaryKey(),
  funnelId: integer('funnel_id').notNull(),
  clientId: integer('client_id'), // nullable until converted
  responses: jsonb('responses'), // JSON: form responses
  status: text('status').default('pending').notNull(), // pending, completed, converted
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Proposal Templates schema
export const proposalTemplatesSchema = pgTable('proposal_templates', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id').notNull(),
  name: text('name').notNull(),
  content: text('content').notNull(), // Markdown or rich text
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Proposals schema
export const proposalsSchema = pgTable('proposals', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id').notNull(),
  templateId: integer('template_id'),
  clientId: integer('client_id'),
  leadId: integer('lead_id'),
  status: text('status').default('Draft').notNull(), // Draft, Sent, Accepted, Rejected
  content: text('content').notNull(), // Rendered content with placeholders replaced
  signedAt: timestamp('signed_at', { mode: 'date' }),
  signedBy: text('signed_by'), // Name of signer
  signedIp: text('signed_ip'), // IP address for legal tracking
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// Files schema
export const filesSchema = pgTable('files', {
  id: serial('id').primaryKey(),
  organizationId: text('organization_id').notNull(),
  projectId: integer('project_id'),
  name: text('name').notNull(),
  url: text('url').notNull(),
  size: integer('size'), // bytes
  mimeType: text('mime_type'),
  uploadedBy: text('uploaded_by'), // Clerk user ID
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
