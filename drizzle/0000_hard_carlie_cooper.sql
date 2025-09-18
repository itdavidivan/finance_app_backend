CREATE TABLE "expenses" (
	"id" uuid DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"description" varchar NOT NULL,
	"expense_type" "expense_type" DEFAULT 'meal',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid DEFAULT gen_random_uuid(),
	"username" varchar NOT NULL,
	"password" varchar NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
