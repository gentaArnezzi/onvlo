CREATE TABLE IF NOT EXISTS "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"company" text,
	"stripe_customer_id" text,
	"status" text DEFAULT 'active' NOT NULL,
	"notes" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"project_id" integer,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"size" integer,
	"mime_type" text,
	"uploaded_by" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoice_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_id" integer NOT NULL,
	"description" text NOT NULL,
	"quantity" real DEFAULT 1 NOT NULL,
	"unit_price" real NOT NULL,
	"total" real NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"client_id" integer NOT NULL,
	"project_id" integer,
	"invoice_number" text NOT NULL,
	"status" text DEFAULT 'Draft' NOT NULL,
	"due_date" timestamp NOT NULL,
	"subtotal" real DEFAULT 0 NOT NULL,
	"tax" real DEFAULT 0 NOT NULL,
	"tax_rate" real DEFAULT 0 NOT NULL,
	"total" real DEFAULT 0 NOT NULL,
	"notes" text,
	"stripe_payment_intent_id" text,
	"paid_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"company" text,
	"source" text,
	"stage" text DEFAULT 'New' NOT NULL,
	"tags" text,
	"notes" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onboarding_funnels" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"config" jsonb,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onboarding_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"funnel_id" integer NOT NULL,
	"client_id" integer,
	"responses" jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"client_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'Planned' NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"budget" real,
	"owner_id" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "proposal_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"content" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "proposals" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"template_id" integer,
	"client_id" integer,
	"lead_id" integer,
	"status" text DEFAULT 'Draft' NOT NULL,
	"content" text NOT NULL,
	"signed_at" timestamp,
	"signed_by" text,
	"signed_ip" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"assignee_id" text,
	"status" text DEFAULT 'Backlog' NOT NULL,
	"priority" text DEFAULT 'Medium',
	"due_date" timestamp,
	"visible_to_client" boolean DEFAULT false NOT NULL,
	"labels" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "logo" text;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "brand_color" text;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "timezone" text DEFAULT 'UTC' NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "default_currency" text DEFAULT 'USD' NOT NULL;--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "default_invoice_terms" text DEFAULT 'Net 30' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "organization_slug_idx" ON "organization" USING btree ("slug");