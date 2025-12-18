import { Inject, Injectable } from '@nestjs/common';
import { UserRepo, User } from '@wiwiewei18/wilin-storage-domain';
import { eq } from 'drizzle-orm';
import { DB_CLIENT } from '../../../../infra/database/database.module';
import { userTable } from '../../../../infra/database/drizzle/schemas/user.schema';

@Injectable()
export class PostgresUserRepo implements UserRepo {
  constructor(@Inject(DB_CLIENT) private readonly db) {}

  async findByGoogleId(googleId: string): Promise<User | null> {
    const data = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.googleId, googleId))
      .limit(1);
    if (data.length === 0) return null;
    return User.reconstitute(data[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);
    if (data.length === 0) return null;
    return User.reconstitute(data[0]);
  }

  async save(user: User): Promise<void> {
    const record = user.toJSON();
    await this.db.insert(userTable).values(record).onConflictDoUpdate({
      target: userTable.id,
      set: record,
    });
  }
}
