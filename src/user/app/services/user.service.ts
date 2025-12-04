import { Injectable } from '@nestjs/common';
import { SignInWithGoogleUseCase } from '@wiwiewei18/wilin-storage-domain';
import { GoogleTokenService } from 'src/infra/authentication/google/googleToken.service';
import { PostgresUserRepository } from 'src/user/infra/postgresUserRepository';

@Injectable()
export class UserService {
  constructor(
    private readonly google: GoogleTokenService,
    private readonly repo: PostgresUserRepository,
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

    return result.user;
  }
}
