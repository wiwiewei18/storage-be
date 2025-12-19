import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

@Injectable()
export class R2ObjectStorage {
  private client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET}`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY!,
        secretAccessKey: process.env.R2_SECRET_KEY!,
      },
    });
  }

  async generateUploadURL(input: {
    key: string;
    contentType: string;
    expiryInSeconds: number;
  }) {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: input.key,
      ContentType: input.contentType,
    });

    return getSignedUrl(this.client, command, {
      expiresIn: input.expiryInSeconds,
    });
  }
}
