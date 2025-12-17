import { Injectable } from '@nestjs/common';
import { CreateFileOwnerUseCase } from '@wiwiewei18/wilin-storage-domain';
import { PostgresFileOwnerRepository } from '../repos/postgresFileOwnerRepository';
import { type UserSignedUpIntegrationEvent } from 'src/shared/events/userSignedUp.integration';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class UserSignedUpSubscriber {
  constructor(private readonly fileOwnerRepo: PostgresFileOwnerRepository) {}

  @RabbitSubscribe({
    exchange: 'user.exchange',
    routingKey: 'user.signed_up',
    queue: 'storage.create-file-owner',
  })
  async handle(event: UserSignedUpIntegrationEvent) {
    const useCase = new CreateFileOwnerUseCase(this.fileOwnerRepo);

    await useCase.execute({ userId: event.payload.userId });
  }
}
