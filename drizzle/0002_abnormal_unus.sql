ALTER TYPE "public"."expense_type" ADD VALUE 'other';--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "amount" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");