import { IsString } from 'class-validator';

export class SignInWithGoogleDTO {
  @IsString()
  idToken: string;
}
