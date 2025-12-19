import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/infra/authentication/jwt/jwtAuth.guard';
import { StorageService } from '../services/storage.service';
import { RequestFileUploadDTO } from '../dtos/requestFileUpload.dto';

@Controller('storage')
export class StorageController {
  constructor(private readonly service: StorageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('request-file-upload')
  async requestFileUpload(@Req() req, @Body() body: RequestFileUploadDTO) {
    return await this.service.requestFileUpload({
      userId: req.user.userId,
      name: body.name,
      size: body.size,
      type: body.type,
    });
  }
}
