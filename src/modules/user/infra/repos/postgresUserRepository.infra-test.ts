import { Test } from '@nestjs/testing';
import { PostgresUserRepository } from './postgresUserRepository';
import { DatabaseModule } from '../../../../infra/database/database.module';
import { User } from '@wiwiewei18/wilin-storage-domain';
import { dbClient, pool } from '../../../../infra/database/drizzle/drizzle';
import { userTable } from '../../../../infra/database/drizzle/schemas/user.schema';

describe('PostgresUserRepository', () => {
  let userRepo: PostgresUserRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [PostgresUserRepository],
    }).compile();

    userRepo = moduleRef.get(PostgresUserRepository);
  });

  beforeEach(async () => {
    await dbClient.delete(userTable).execute();
  });

  afterAll(async () => {
    pool.end();
  });

  it('should save a user when given a valid user', async () => {
    const user = User.create('john.doe@mail.com');

    await userRepo.save(user);
    const storedUser = await userRepo.findByEmail(user.email);

    expect(storedUser).toBeInstanceOf(User);
    expect(storedUser?.email).toBe(user.email);
  });

  it('should return the user when given an existing email', async () => {
    const user = User.create('john.doe@mail.com');

    await userRepo.save(user);
    const storedUser = await userRepo.findByEmail(user.email);

    expect(storedUser).toBeInstanceOf(User);
    expect(storedUser?.email).toBe(user.email);
  });

  it('should return null when given non existing email', async () => {
    const storedUser = await userRepo.findByEmail(
      'non.existing.email@mail.com',
    );

    expect(storedUser).toBe(null);
  });

  it('should return the user when given an existing googleId', async () => {
    const user = User.create('john.doe@mail.com', 'google-id');

    await userRepo.save(user);
    const storedUser = await userRepo.findByGoogleId(user.googleId!);

    expect(storedUser).toBeInstanceOf(User);
    expect(storedUser?.googleId).toBe(user.googleId);
  });

  it('should return null when given non existing googleId', async () => {
    const storedUser = await userRepo.findByGoogleId('non.existing.google.id');

    expect(storedUser).toBe(null);
  });
});
