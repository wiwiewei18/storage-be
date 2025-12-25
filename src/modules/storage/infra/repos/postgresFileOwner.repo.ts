import { Inject } from '@nestjs/common';
import { FileOwner, FileOwnerRepo } from '@wiwiewei18/storage-domain';
import { eq } from 'drizzle-orm';
import { DB_CLIENT } from 'src/infra/database/database.module';
import { fileOwnerTable } from 'src/infra/database/drizzle/schemas/fileOwner.schema';

export class PostgresFileOwnerRepo implements FileOwnerRepo {
  constructor(@Inject(DB_CLIENT) private readonly db) {}

  async findByUserId(userId: string): Promise<FileOwner | null> {
    const data = await this.db
      .select()
      .from(fileOwnerTable)
      .where(eq(fileOwnerTable.userId, userId));
    if (data.length === 0) return null;
    return FileOwner.reconstitute(data[0]);
  }

  async save(fileOwner: FileOwner): Promise<void> {
    const record = fileOwner.toJSON();
    await this.db.insert(fileOwnerTable).values(record).onConflictDoUpdate({
      target: fileOwnerTable.id,
      set: record,
    });
  }
}
