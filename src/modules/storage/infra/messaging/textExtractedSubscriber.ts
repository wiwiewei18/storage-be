import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { type TextExtractedIntegrationEvent } from 'src/shared/events/textExtracted.integration';
import { PostgresFileRepo } from '../repos/postgresFile.repo';
import { SaveExtractedTextUseCase } from '@wiwiewei18/storage-domain';

@Injectable()
export class TextExtractedSubscriber {
  constructor(private readonly fileRepo: PostgresFileRepo) {}

  @RabbitSubscribe({
    exchange: 'ocr.exchange',
    routingKey: 'text.extracted',
    queue: 'storage.save-extracted-text',
  })
  async handle(event: TextExtractedIntegrationEvent) {
    const saveExtractedTextUseCase = new SaveExtractedTextUseCase(
      this.fileRepo,
    );

    await saveExtractedTextUseCase.execute({
      fileId: event.payload.fileId,
      text: event.payload.text,
    });
  }
}
