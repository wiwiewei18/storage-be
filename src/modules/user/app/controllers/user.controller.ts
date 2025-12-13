import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { SignInWithGoogleDTO } from '../dtos/signInWithGoogle.dto';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('sign-in-with-google')
  async signInWithGoogle(@Body() body: SignInWithGoogleDTO) {
    return await this.service.signInWithGoogle(body.idToken);
  }
}
