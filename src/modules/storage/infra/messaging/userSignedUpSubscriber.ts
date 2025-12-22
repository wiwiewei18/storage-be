import { Injectable } from '@nestjs/common';
import { CreateFileOwnerUseCase } from '@wiwiewei18/storage-domain';
import { PostgresFileOwnerRepo } from '../repos/postgresFileOwner.repo';
import { type UserSignedUpIntegrationEvent } from 'src/shared/events/userSignedUp.integration';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class UserSignedUpSubscriber {
  constructor(private readonly fileOwnerRepo: PostgresFileOwnerRepo) {}

  @RabbitSubscribe({
    exchange: 'user.exchange',
    routingKey: 'user.signed_up',
    queue: 'storage.create-file-owner',
  })
  async handle(event: UserSignedUpIntegrationEvent) {
    const createFileOwnerUseCase = new CreateFileOwnerUseCase(
      this.fileOwnerRepo,
    );

    await createFileOwnerUseCase.execute({ userId: event.payload.userId });
  }
}
