CREATE TABLE IF NOT EXISTS "client_interactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"client_id" integer NOT NULL,
	"type" text NOT NULL,
	"content" text NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"sentiment" text,
	"performed_by" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deal_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"deal_id" integer NOT NULL,
	"type" text NOT NULL,
	"content" text NOT NULL,
	"performed_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "deals" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"lead_id" integer,
	"title" text NOT NULL,
	"value" real DEFAULT 0,
	"currency" text DEFAULT 'USD',
	"stage" text DEFAULT 'New' NOT NULL,
	"priority" text DEFAULT 'Medium',
	"expected_close_date" timestamp,
	"owner_id" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "time_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"task_id" integer,
	"project_id" integer,
	"user_id" text NOT NULL,
	"description" text,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"duration" integer,
	"billable" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
