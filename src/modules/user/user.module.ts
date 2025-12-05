import { Module } from '@nestjs/common';
import { UserService } from './app/services/user.service';
import { UserController } from './app/controllers/user.controller';
import { GoogleTokenService } from 'src/infra/authentication/google/googleToken.service';
import { PostgresUserRepository } from './infra/postgresUserRepository';
import { DrizzleProvider } from 'src/infra/database/drizzle/drizzle.provider';

@Module({
  controllers: [UserController],
  providers: [
    DrizzleProvider,
    PostgresUserRepository,
    UserService,
    GoogleTokenService,
  ],
})
export class UserModule {}
