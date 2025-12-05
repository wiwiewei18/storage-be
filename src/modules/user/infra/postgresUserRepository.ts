import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, User } from '@wiwiewei18/wilin-storage-domain';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from 'src/infra/database/drizzle/drizzle.provider';
import { userTable } from 'src/infra/database/drizzle/schemas/user.schema';

@Injectable()
export class PostgresUserRepository implements IUserRepository {
  constructor(@Inject(DRIZZLE) private readonly dbClient) {}

  async findByGoogleId(googleId: string): Promise<User | null> {
    const data = await this.dbClient
      .select()
      .from(userTable)
      .where(eq(userTable.googleId, googleId))
      .limit(1);
    if (data.length === 0) return null;
    return User.reconstitute(data[0]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await this.dbClient
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);
    if (data.length === 0) return null;
    return User.reconstitute(data[0]);
  }

  async save(user: User): Promise<void> {
    const record = user.toJSON();
    await this.dbClient.insert(userTable).values(record).onConflictDoUpdate({
      target: userTable.id,
      set: record,
    });
  }
}
