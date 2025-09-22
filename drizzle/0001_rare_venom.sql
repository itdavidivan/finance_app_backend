CREATE TYPE "public"."expense_type" AS ENUM('car', 'meal', 'house');--> statement-breakpoint
ALTER TABLE "expenses" ALTER COLUMN "description" SET DATA TYPE text;