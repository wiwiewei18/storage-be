import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { FileUploaded } from '@wiwiewei18/storage-domain';
import { FileUploadedIntegrationEvent } from 'src/shared/events/fileUploaded.integration';

@Injectable()
export class StorageEventPublisher {
  constructor(private readonly amqp: AmqpConnection) {}

  async publish(events: Array<any>) {
    for (const event of events) {
      if (event instanceof FileUploaded) {
        const integrationEvent: FileUploadedIntegrationEvent = {
          eventName: 'FileUploaded',
          payload: {
            fileId: event.fileId,
            objectKey: event.objectKey,
            mimeType: event.mimeType,
          },
          occurredAt: event.occurredAt.toISOString(),
        };

        await this.amqp.publish(
          'storage.exchange',
          'file.uploaded',
          integrationEvent,
        );
      }
    }
  }
}
