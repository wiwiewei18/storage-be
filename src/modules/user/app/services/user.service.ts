import { Injectable } from '@nestjs/common';
import { SignInWithGoogleUseCase } from '@wiwiewei18/wilin-storage-domain';
import { GoogleTokenService } from '../../../../infra/authentication/google/googleToken.service';
import { PostgresUserRepository } from '../../infra/postgresUserRepository';
import { JwtTokenService } from 'src/infra/authentication/jwt/jwtToken.service';
import { PostgresRefreshTokenRepository } from '../../infra/postgresRefreshTokenRepository';
import {
  generateRefreshToken,
  hashToken,
} from 'src/infra/authentication/token.util';

@Injectable()
export class UserService {
  constructor(
    private readonly google: GoogleTokenService,
    private readonly jwt: JwtTokenService,
    private readonly userRepo: PostgresUserRepository,
    private readonly refreshTokenRepo: PostgresRefreshTokenRepository,
  ) {}

  async signInWithGoogle(idToken: string) {
    const payload = await this.google.verifyIdToken(idToken);

    if (!payload || !payload.sub || !payload.email) {
      throw new Error('Invalid Google ID token');
    }

    const useCase = new SignInWithGoogleUseCase(this.userRepo);

    const result = await useCase.execute({
      googleId: payload.sub,
      email: payload.email,
      name: payload.name ?? '',
      pictureUrl: payload.picture ?? '',
    });

    const accessToken = this.jwt.signAccessToken({
      userId: result.user.id,
      name: result.user.name ?? '',
      email: result.user.email,
    });

    const refreshToken = generateRefreshToken();
    await this.refreshTokenRepo.save({
      userId: result.user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    return { user: result.user, accessToken, refreshToken };
  }
}
