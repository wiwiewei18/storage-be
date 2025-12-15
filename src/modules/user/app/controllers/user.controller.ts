import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { SignInWithGoogleDTO } from '../dtos/signInWithGoogle.dto';
import { JwtAuthGuard } from 'src/infra/authentication/jwt/jwtAuth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('sign-in-with-google')
  async signInWithGoogle(@Body() body: SignInWithGoogleDTO) {
    return await this.service.signInWithGoogle(body.idToken);
  }

  @Post('sign-out')
  @HttpCode(204)
  async signOut(@Body('refreshToken') refreshToken: string) {
    return await this.service.signOut(refreshToken);
  }

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.service.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-profile')
  getMyProfile(@Req() req) {
    return {
      userId: req.user.userId,
    };
  }
}
