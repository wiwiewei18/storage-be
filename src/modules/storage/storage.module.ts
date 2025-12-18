import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { RabbitMQModule } from 'src/infra/messaging/rabbitmq/rabbitmq.module';
import { UserSignedUpSubscriber } from './infra/messaging/userSignedUpSubscriber';
import { PostgresFileOwnerRepo } from './infra/repos/postgresFileOwner.repo';

@Module({
  imports: [DatabaseModule, RabbitMQModule],
  providers: [PostgresFileOwnerRepo, UserSignedUpSubscriber],
})
export class StorageModule {}
