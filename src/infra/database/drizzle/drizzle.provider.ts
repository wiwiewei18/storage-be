import { Provider } from '@nestjs/common';
import { db } from './db';

export const DRIZZLE = Symbol('DRIZZLE');

export const DrizzleProvider: Provider = {
  provide: DRIZZLE,
  useValue: db,
};
