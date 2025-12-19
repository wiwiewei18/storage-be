import { Injectable } from '@nestjs/common';
import {
  CompleteFileUploadUseCase,
  RequestFileUploadUseCase,
} from '@wiwiewei18/wilin-storage-domain';
import { PostgresFileRepo } from '../../infra/repos/postgresFile.repo';
import { PostgresFileOwnerRepo } from '../../infra/repos/postgresFileOwner.repo';
import { R2ObjectStorage } from 'src/infra/storage/cloudflare/r2ObjectStorage.service';

@Injectable()
export class StorageService {
  constructor(
    private readonly fileRepo: PostgresFileRepo,
    private readonly fileOwnerRepo: PostgresFileOwnerRepo,
    private readonly objectStorage: R2ObjectStorage,
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

    const uploadURL = await this.objectStorage.generateUploadURL({
      key: output.file.objectKey,
      contentType: output.file.type.toString(),
      expiryInSeconds: 300,
    });

    return {
      fileId: output.file.id,
      uploadURL,
    };
  }

  async completeFileUpload(fileId: string) {
    const completeFileUploadUseCase = new CompleteFileUploadUseCase(
      this.fileRepo,
    );

    const file = await this.fileRepo.findById(fileId);

    if (!file) throw new Error('File not found');

    const uploadedFile = await this.objectStorage.verifyObject(file.objectKey);

    if (uploadedFile.size !== file.size.toNumber()) {
      throw new Error('Uploaded size mismatch');
    }

    if (uploadedFile.contentType !== file.type.toString()) {
      throw new Error('Uploaded content type mismatch');
    }

    const output = await completeFileUploadUseCase.execute({ id: fileId });

    return { fileId: output.file.id, status: output.file.status };
  }
}
