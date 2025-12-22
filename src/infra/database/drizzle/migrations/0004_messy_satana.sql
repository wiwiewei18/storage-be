CREATE TABLE "files" (
	"id" uuid PRIMARY KEY NOT NULL,
	"file_owner_id" uuid NOT NULL,
	"name" varchar NOT NULL,
	"size" bigint NOT NULL,
	"type" varchar NOT NULL,
	"status" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
