import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { RabbitMQModule } from 'src/infra/messaging/rabbitmq/rabbitmq.module';
import { UserSignedUpSubscriber } from './infra/messaging/userSignedUpSubscriber';
import { PostgresFileOwnerRepo } from './infra/repos/postgresFileOwner.repo';
import { StorageController } from './app/controllers/storage.controller';
import { StorageService } from './app/services/storage.service';
import { JwtAuthModule } from 'src/infra/authentication/jwt/jwtAuth.module';
import { PostgresFileRepo } from './infra/repos/postgresFile.repo';
import { R2ObjectStorage } from 'src/infra/storage/cloudflare/r2ObjectStorage.service';

@Module({
  imports: [DatabaseModule, JwtAuthModule, RabbitMQModule],
  controllers: [StorageController],
  providers: [
    PostgresFileOwnerRepo,
    PostgresFileRepo,
    R2ObjectStorage,
    UserSignedUpSubscriber,
    StorageService,
  ],
})
export class StorageModule {}
