import {
  varchar,
  timestamp,
  bigint,
  uuid,
  pgTable,
  text,
} from 'drizzle-orm/pg-core';

export const fileTable = pgTable('files', {
  id: uuid('id').primaryKey(),
  fileOwnerId: uuid('file_owner_id').notNull(),
  objectKey: text('object_key').notNull(),
  name: varchar('name').notNull(),
  size: bigint('size', { mode: 'number' }).notNull(),
  type: varchar('type').notNull(),
  status: varchar('status').notNull(),
  extractedText: text('extracted_text'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
