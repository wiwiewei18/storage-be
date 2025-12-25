import { GoogleTokenService } from './googleToken.service';

const mockVerifyIdToken = jest.fn();

jest.mock('google-auth-library', () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => ({
      verifyIdToken: mockVerifyIdToken,
    })),
  };
});

describe('GoogleTokenService', () => {
  let service: GoogleTokenService;

  beforeEach(() => {
    process.env.GOOGLE_CLIENT_ID = 'google-client-id';

    mockVerifyIdToken.mockReset();

    service = new GoogleTokenService();
  });

  it('should verify token and return payload', async () => {
    const mockPayload = {
      sub: '1234567890',
      email: 'john.doe@mail.com',
      name: 'John Doe',
    };
    const mockTicket = {
      getPayload: jest.fn().mockReturnValue(mockPayload),
    };
    mockVerifyIdToken.mockResolvedValue(mockTicket);

    const result = await service.verifyIdToken('id-token');

    expect(mockVerifyIdToken).toHaveBeenCalledWith({
      idToken: 'id-token',
      audience: 'google-client-id',
    });
    expect(result).toEqual(mockPayload);
  });

  it('should throw error when verifyIdToken fails', async () => {
    mockVerifyIdToken.mockRejectedValue(new Error('Invalid token'));

    await expect(service.verifyIdToken('invalid-id-token')).rejects.toThrow(
      'Invalid token',
    );
  });
});
