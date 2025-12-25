import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';

export const userTable = pgTable('users', {
  id: varchar('id').primaryKey(),
  email: varchar('email').notNull().unique(),
  googleId: varchar('google_id'),
  name: varchar('name'),
  pictureUrl: varchar('picture_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
