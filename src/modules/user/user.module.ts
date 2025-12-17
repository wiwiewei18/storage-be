import { Module } from '@nestjs/common';
import { UserService } from './app/services/user.service';
import { UserController } from './app/controllers/user.controller';
import { GoogleTokenService } from '../../infra/authentication/google/googleToken.service';
import { PostgresUserRepository } from './infra/repos/postgresUserRepository';
import { DatabaseModule } from '../../infra/database/database.module';
import { JwtAuthModule } from 'src/infra/authentication/jwt/jwtAuth.module';
import { PostgresRefreshTokenRepository } from './infra/repos/postgresRefreshTokenRepository';
import { RabbitMQModule } from 'src/infra/messaging/rabbitmq/rabbitmq.module';
import { UserEventPublisher } from './infra/messaging/userEventPublisher';

@Module({
  imports: [DatabaseModule, JwtAuthModule, RabbitMQModule],
  controllers: [UserController],
  providers: [
    PostgresUserRepository,
    PostgresRefreshTokenRepository,
    GoogleTokenService,
    UserEventPublisher,
    UserService,
  ],
})
export class UserModule {}
