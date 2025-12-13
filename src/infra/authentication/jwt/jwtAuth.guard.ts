import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtTokenService } from './jwtToken.service';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtTokenService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) throw new UnauthorizedException();

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) throw new UnauthorizedException();

    try {
      const payload = this.jwt.verify(token);
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
