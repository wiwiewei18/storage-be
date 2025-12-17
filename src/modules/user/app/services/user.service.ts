import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInWithGoogleUseCase } from '@wiwiewei18/wilin-storage-domain';
import { GoogleTokenService } from '../../../../infra/authentication/google/googleToken.service';
import { PostgresUserRepository } from '../../infra/repos/postgresUserRepository';
import { JwtTokenService } from 'src/infra/authentication/jwt/jwtToken.service';
import { PostgresRefreshTokenRepository } from '../../infra/repos/postgresRefreshTokenRepository';
import {
  generateRefreshToken,
  hashToken,
} from 'src/infra/authentication/token.util';
import { UserEventPublisher } from '../../infra/messaging/userEventPublisher';

@Injectable()
export class UserService {
  constructor(
    private readonly google: GoogleTokenService,
    private readonly jwt: JwtTokenService,
    private readonly userRepo: PostgresUserRepository,
    private readonly refreshTokenRepo: PostgresRefreshTokenRepository,
    private readonly userEventPublisher: UserEventPublisher,
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
    });

    const refreshToken = generateRefreshToken();
    await this.refreshTokenRepo.save({
      userId: result.user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    await this.userEventPublisher.publish(result.events);

    return { user: result.user, accessToken, refreshToken };
  }

  async signOut(refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);

    const stored = await this.refreshTokenRepo.findValid(tokenHash);

    if (!stored) {
      return;
    }

    await this.refreshTokenRepo.revoke(stored.id);
  }

  async refreshToken(refreshToken: string) {
    const tokenHash = hashToken(refreshToken);

    const stored = await this.refreshTokenRepo.findValid(tokenHash);
    if (!stored) throw new UnauthorizedException();

    await this.refreshTokenRepo.revoke(stored.id);

    const accessToken = this.jwt.signAccessToken({
      userId: stored.userId,
    });

    const newRefreshToken = generateRefreshToken();
    await this.refreshTokenRepo.save({
      userId: stored.userId,
      tokenHash: hashToken(newRefreshToken),
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
