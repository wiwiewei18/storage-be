import { IsNumber, IsString } from 'class-validator';

export class RequestFileUploadDTO {
  @IsString()
  name!: string;

  @IsNumber()
  size!: number;

  @IsString()
  type!: string;
}
