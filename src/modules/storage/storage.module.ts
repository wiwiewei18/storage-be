import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { RabbitMQModule } from 'src/infra/messaging/rabbitmq/rabbitmq.module';
import { UserSignedUpSubscriber } from './infra/messaging/userSignedUpSubscriber';
import { PostgresFileOwnerRepository } from './infra/repos/postgresFileOwnerRepository';

@Module({
  imports: [DatabaseModule, RabbitMQModule],
  providers: [PostgresFileOwnerRepository, UserSignedUpSubscriber],
})
export class StorageModule {}
