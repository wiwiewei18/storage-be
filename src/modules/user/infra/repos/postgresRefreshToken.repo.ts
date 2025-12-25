import { eq } from 'drizzle-orm';
import { Inject } from '@nestjs/common';
import { DB_CLIENT } from 'src/infra/database/database.module';
import { refreshTokenTable } from 'src/infra/database/drizzle/schemas/refreshToken.schema';

export class PostgresRefreshTokenRepo {
  constructor(@Inject(DB_CLIENT) private readonly db) {}

  async save(data: { userId: string; tokenHash: string; expiresAt: Date }) {
    await this.db.insert(refreshTokenTable).values(data);
  }

  async findByTokenHash(tokenHash: string) {
    const result = await this.db
      .select()
      .from(refreshTokenTable)
      .where(eq(refreshTokenTable.tokenHash, tokenHash))
      .limit(1);

    const token = result[0];
    if (!token) return null;
    if (token.revokedAt) return null;
    if (token.expiresAt < new Date()) return null;

    return token;
  }

  async revoke(id: string) {
    await this.db
      .update(refreshTokenTable)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokenTable.id, id));
  }
}
