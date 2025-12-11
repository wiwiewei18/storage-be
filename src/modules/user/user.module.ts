import { Module } from '@nestjs/common';
import { UserService } from './app/services/user.service';
import { UserController } from './app/controllers/user.controller';
import { GoogleTokenService } from '../../infra/authentication/google/googleToken.service';
import { PostgresUserRepository } from './infra/postgresUserRepository';
import { DatabaseModule } from '../../infra/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [PostgresUserRepository, UserService, GoogleTokenService],
})
export class UserModule {}
