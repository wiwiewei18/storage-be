import { IsString } from 'class-validator';

export class CompleteFileUploadDTO {
  @IsString()
  fileId!: string;
}
