import { GoogleTokenService } from '../../../../infra/authentication/google/googleToken.service';
import { UserService } from './user.service';
import { PostgresUserRepository } from '../../infra/postgresUserRepository';
import { Test } from '@nestjs/testing';
import { User } from '@wiwiewei18/wilin-storage-domain';
import { TokenPayload } from 'google-auth-library';

describe('UserService', () => {
  let service: UserService;
  let mockGoogleTokenService: jest.Mocked<GoogleTokenService>;
  let mockUserRepo: jest.Mocked<PostgresUserRepository>;

  const dummyUser = User.create(
    'john.doe@mail.com',
    'google-id',
    'John Doe',
    'picture-url',
  );

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: GoogleTokenService, useValue: { verifyIdToken: jest.fn() } },
        {
          provide: PostgresUserRepository,
          useValue: {
            findByGoogleId: jest.fn(),
            findByEmail: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = testingModule.get(UserService);
    mockGoogleTokenService = testingModule.get(GoogleTokenService);
    mockUserRepo = testingModule.get(PostgresUserRepository);
  });

  it('should sign in and return the user when given a valid id token for existing user', async () => {
    const mockVerifyIdTokenOutput = {
      sub: dummyUser.googleId,
      email: dummyUser.email,
      name: dummyUser.name,
      picture: dummyUser.pictureUrl,
    } as unknown as TokenPayload;
    mockGoogleTokenService.verifyIdToken.mockResolvedValue(
      mockVerifyIdTokenOutput,
    );
    mockUserRepo.findByGoogleId.mockResolvedValue(dummyUser);

    const result = await service.signInWithGoogle('valid-id-token');

    expect(mockGoogleTokenService.verifyIdToken).toHaveBeenCalledWith(
      'valid-id-token',
    );
    expect(mockUserRepo.findByGoogleId).toHaveBeenCalledWith(
      dummyUser.googleId,
    );
    expect(result.user).toEqual(dummyUser);
  });

  it('should sign up, sign in and return the user when given a valid id token for non-existing user', async () => {
    const mockVerifyIdTokenOutput = {
      sub: dummyUser.googleId,
      email: dummyUser.email,
      name: dummyUser.name,
      picture: dummyUser.pictureUrl,
    } as unknown as TokenPayload;
    mockGoogleTokenService.verifyIdToken.mockResolvedValue(
      mockVerifyIdTokenOutput,
    );
    mockUserRepo.findByGoogleId.mockResolvedValue(null);
    mockUserRepo.findByEmail.mockResolvedValue(null);

    const result = await service.signInWithGoogle('valid-id-token');

    expect(mockGoogleTokenService.verifyIdToken).toHaveBeenCalledWith(
      'valid-id-token',
    );
    expect(mockUserRepo.findByGoogleId).toHaveBeenCalledWith(
      dummyUser.googleId,
    );
    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(dummyUser.email);
    expect(mockUserRepo.save).toHaveBeenCalled();
    expect(result.user.name).toEqual(dummyUser.name);
    expect(result.user.email).toEqual(dummyUser.email);
    expect(result.user.googleId).toEqual(dummyUser.googleId);
    expect(result.user.pictureUrl).toEqual(dummyUser.pictureUrl);
  });

  it('should not sign in and throw error when given an invalid id token', async () => {
    mockGoogleTokenService.verifyIdToken.mockResolvedValue(undefined);

    await expect(service.signInWithGoogle('invalid-id-token')).rejects.toThrow(
      Error,
    );
  });
});
