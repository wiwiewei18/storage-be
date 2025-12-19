import { Inject } from '@nestjs/common';
import {
  File,
  FileSize,
  FileType,
  FileRepo,
} from '@wiwiewei18/wilin-storage-domain';
import { eq } from 'drizzle-orm';
import { DB_CLIENT } from 'src/infra/database/database.module';
import { fileTable } from 'src/infra/database/drizzle/schemas/file.schema';

export class PostgresFileRepo implements FileRepo {
  constructor(@Inject(DB_CLIENT) private readonly db) {}

  async findById(id: string): Promise<File | null> {
    const data = await this.db
      .select()
      .from(fileTable)
      .where(eq(fileTable.id, id));
    if (data.length === 0) return null;
    return File.reconstitute({
      ...data[0],
      size: FileSize.create(data[0].size),
      type: FileType.create(data[0].type),
    });
  }

  async save(file: File): Promise<void> {
    const record = file.toJSON();
    await this.db.insert(fileTable).values(record).onConflictDoUpdate({
      target: fileTable.id,
      set: record,
    });
  }
}
