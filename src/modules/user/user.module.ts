import { Module } from '@nestjs/common';
import { UserService } from './app/services/user.service';
import { UserController } from './app/controllers/user.controller';
import { GoogleTokenService } from '../../infra/authentication/google/googleToken.service';
import { PostgresUserRepository } from './infra/repos/postgresUserRepository';
import { DatabaseModule } from '../../infra/database/database.module';
import { JwtAuthModule } from 'src/infra/authentication/jwt/jwtAuth.module';
import { PostgresRefreshTokenRepository } from './infra/repos/postgresRefreshTokenRepository';

@Module({
  imports: [DatabaseModule, JwtAuthModule],
  controllers: [UserController],
  providers: [
    PostgresUserRepository,
    PostgresRefreshTokenRepository,
    UserService,
    GoogleTokenService,
  ],
})
export class UserModule {}
