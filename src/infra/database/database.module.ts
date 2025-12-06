import { Module } from '@nestjs/common';
import { dbClient } from './drizzle/drizzle';

export const DB_CLIENT = Symbol('DB_CLIENT');

@Module({
  providers: [
    {
      provide: DB_CLIENT,
      useValue: dbClient,
    },
  ],
  exports: [DB_CLIENT],
})
export class DatabaseModule {}
