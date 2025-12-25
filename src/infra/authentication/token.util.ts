import { createHash, randomUUID } from 'crypto';

export function generateRefreshToken() {
  return randomUUID();
}

export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}
