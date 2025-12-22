import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInWithGoogleUseCase } from '@wiwiewei18/storage-domain';
import { GoogleTokenService } from '../../../../infra/authentication/google/googleToken.service';
import { PostgresUserRepo } from '../../infra/repos/postgresUser.repo';
import { JwtTokenService } from 'src/infra/authentication/jwt/jwtToken.service';
import { PostgresRefreshTokenRepo } from '../../infra/repos/postgresRefreshToken.repo';
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
    private readonly userRepo: PostgresUserRepo,
    private readonly refreshTokenRepo: PostgresRefreshTokenRepo,
    private readonly userEventPublisher: UserEventPublisher,
  ) {}

  async signInWithGoogle(idToken: string) {
    const payload = await this.google.verifyIdToken(idToken);

    if (!payload || !payload.sub || !payload.email) {
      throw new Error('Invalid Google ID token');
    }

    const signInWithGoogleUseCase = new SignInWithGoogleUseCase(this.userRepo);

    const output = await signInWithGoogleUseCase.execute({
      googleId: payload.sub,
      email: payload.email,
      name: payload.name ?? '',
      pictureUrl: payload.picture ?? '',
    });

    const accessToken = this.jwt.signAccessToken({
      userId: output.user.id,
    });

    const refreshToken = generateRefreshToken();
    await this.refreshTokenRepo.save({
      userId: output.user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    await this.userEventPublisher.publish(output.events);

    return { user: output.user, accessToken, refreshToken };
  }

  async signOut(refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);

    const storedRefreshToken =
      await this.refreshTokenRepo.findByTokenHash(tokenHash);

    if (!storedRefreshToken) {
      return;
    }

    await this.refreshTokenRepo.revoke(storedRefreshToken.id);
  }

  async refreshToken(refreshToken: string) {
    const tokenHash = hashToken(refreshToken);

    const storedRefreshToken =
      await this.refreshTokenRepo.findByTokenHash(tokenHash);
    if (!storedRefreshToken) throw new UnauthorizedException();

    await this.refreshTokenRepo.revoke(storedRefreshToken.id);

    const accessToken = this.jwt.signAccessToken({
      userId: storedRefreshToken.userId,
    });

    const newRefreshToken = generateRefreshToken();
    await this.refreshTokenRepo.save({
      userId: storedRefreshToken.userId,
      tokenHash: hashToken(newRefreshToken),
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
