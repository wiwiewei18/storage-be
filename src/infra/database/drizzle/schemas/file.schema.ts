import { varchar, timestamp, bigint, uuid, pgTable } from 'drizzle-orm/pg-core';

export const fileTable = pgTable('files', {
  id: uuid('id').primaryKey(),
  fileOwnerId: uuid('file_owner_id').notNull(),
  name: varchar('name').notNull(),
  size: bigint('size', { mode: 'number' }).notNull(),
  type: varchar('type').notNull(),
  status: varchar('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
