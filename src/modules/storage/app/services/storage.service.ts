import { Injectable } from '@nestjs/common';
import { RequestFileUploadUseCase } from '@wiwiewei18/wilin-storage-domain';
import { PostgresFileRepo } from '../../infra/repos/postgresFile.repo';
import { PostgresFileOwnerRepo } from '../../infra/repos/postgresFileOwner.repo';

@Injectable()
export class StorageService {
  constructor(
    private readonly fileRepo: PostgresFileRepo,
    private readonly fileOwnerRepo: PostgresFileOwnerRepo,
  ) {}

  async requestFileUpload(payload: {
    userId: string;
    name: string;
    size: number;
    type: string;
  }) {
    const { userId, name, size, type } = payload;

    const requestFileUploadUseCase = new RequestFileUploadUseCase(
      this.fileRepo,
      this.fileOwnerRepo,
    );

    const output = await requestFileUploadUseCase.execute({
      userId,
      name,
      size,
      type,
    });

    return {
      fileId: output.file.id,
    };
  }
}
