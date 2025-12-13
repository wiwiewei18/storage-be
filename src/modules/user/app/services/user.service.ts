import { Injectable } from '@nestjs/common';
import { SignInWithGoogleUseCase } from '@wiwiewei18/wilin-storage-domain';
import { GoogleTokenService } from '../../../../infra/authentication/google/googleToken.service';
import { PostgresUserRepository } from '../../infra/postgresUserRepository';
import { JwtTokenService } from 'src/infra/authentication/jwt/jwtToken.service';

@Injectable()
export class UserService {
  constructor(
    private readonly google: GoogleTokenService,
    private readonly repo: PostgresUserRepository,
    private readonly jwt: JwtTokenService,
  ) {}

  async signInWithGoogle(idToken: string) {
    const payload = await this.google.verifyIdToken(idToken);

    if (!payload || !payload.sub || !payload.email) {
      throw new Error('Invalid Google ID token');
    }

    const useCase = new SignInWithGoogleUseCase(this.repo);

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

    return { user: result.user, accessToken };
  }
}
