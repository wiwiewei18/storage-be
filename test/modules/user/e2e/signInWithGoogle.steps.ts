import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { AppModule } from '../../../../src/app.module';
import request from 'supertest';

let mockVerifyIdToken = jest.fn();

jest.mock(
  `../../../../src/infra/authentication/google/googleToken.service`,
  () => {
    return {
      GoogleTokenService: jest.fn().mockImplementation(() => ({
        verifyIdToken: mockVerifyIdToken,
      })),
    };
  },
);

const feature = loadFeature('test/modules/user/e2e/signInWithGoogle.feature');

defineFeature(feature, (test) => {
  let app: INestApplication;
  let response: request.Response;
  let idToken: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('User signs in successfully with a valid token', ({
    given,
    when,
    then,
    and,
  }) => {
    given('I have a valid Google ID token', () => {
      idToken = 'valid-id-token';
      mockVerifyIdToken.mockResolvedValue({
        sub: 'google-id',
        email: 'john.doe@mail.com',
        name: 'John Doe',
        picture: 'picture-url',
      });
    });

    when(/^I send a POST request to "(.*)"$/, async (endpoint) => {
      response = await request(app.getHttpServer())
        .post(endpoint)
        .send({ idToken });
    });

    then(/^I should receive a (\d+) response$/, (expectedStatusCode) => {
      expect(response.status).toBe(+expectedStatusCode);
    });

    and('the response should contain the signed-in user', () => {
      expect(response.body.email).toBe('john.doe@mail.com');
      expect(response.body.googleId).toBe('google-id');
      expect(response.body.name).toBe('John Doe');
      expect(response.body.pictureUrl).toBe('picture-url');
    });
  });

  test('Sign-in fails because Google token is invalid', ({
    given,
    when,
    then,
  }) => {
    given('I have an invalid Google ID token', () => {
      idToken = 'invalid-id-token';
      mockVerifyIdToken.mockRejectedValue(new Error('Invalid token'));
    });

    when(/^I send a POST request to "(.*)"$/, async (endpoint) => {
      response = await request(app.getHttpServer())
        .post(endpoint)
        .send({ idToken });
    });

    then(/^I should receive a (\d+) response$/, (expectedStatusCode) => {
      expect(response.status).toBe(+expectedStatusCode);
    });
  });
});
