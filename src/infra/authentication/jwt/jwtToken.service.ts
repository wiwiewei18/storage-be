import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwt: JwtService) {}

  signAccessToken(payload: { userId: string }) {
    return this.jwt.sign(payload);
  }

  verify(token: string) {
    return this.jwt.verify(token);
  }
}
