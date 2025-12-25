import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';

export const fileOwnerTable = pgTable('file_owners', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
