import { Inject } from '@nestjs/common';
import {
  File,
  FileSize,
  FileType,
  FileRepo,
  FileSearchResult,
} from '@wiwiewei18/storage-domain';
import { and, sql } from 'drizzle-orm';
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

  async findFileListByFileOwnerId(fileOwnerId: string): Promise<File[]> {
    const dataList = await this.db
      .select()
      .from(fileTable)
      .where(eq(fileTable.fileOwnerId, fileOwnerId));
    return dataList.map((data) =>
      File.reconstitute({
        ...data,
        size: FileSize.create(data.size),
        type: FileType.create(data.type),
      }),
    );
  }

  async search(
    fileOwnerId: string,
    keyword: string,
  ): Promise<FileSearchResult[]> {
    const rows = await this.db
      .select({
        id: fileTable.id,
        fileName: fileTable.name,
        nameHighlight: sql`ts_headline('simple', ${fileTable.name}, plainto_tsquery('simple', ${keyword}), 'StartSel=<mark>, StopSel=</mark>')`,
        contentHighlight: sql`ts_headline('simple', ${fileTable.extractedText}, plainto_tsquery('simple', ${keyword}), 'StartSel=<mark>, StopSel=</mark>, MaxFragments=2')`,
        size: fileTable.size,
        type: fileTable.type,
        createdAt: fileTable.createdAt,
      })
      .from(fileTable)
      .where(
        and(
          eq(fileTable.fileOwnerId, fileOwnerId),
          sql`search_vector @@ plainto_tsquery('simple', ${keyword})`,
        ),
      );

    return rows.map((row) => ({
      id: row.id,
      name: row.fileName,
      nameHighlight: row.nameHighlight,
      contentHighlight: row.contentHighlight,
      size: row.size,
      type: row.type,
      createdAt: row.createdAt,
    }));
  }

  async save(file: File): Promise<void> {
    const record = file.toJSON();
    await this.db.insert(fileTable).values(record).onConflictDoUpdate({
      target: fileTable.id,
      set: record,
    });
  }
}
