ALTER TABLE "file_owners" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "file_owners" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "file_owners" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;