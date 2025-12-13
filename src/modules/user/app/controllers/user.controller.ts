import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @Get('/my-profile')
  getMyProfile(@Req() req) {
    return {
      userId: req.user.userId,
      name: req.user.name,
      email: req.user.email,
    };
  }
}
