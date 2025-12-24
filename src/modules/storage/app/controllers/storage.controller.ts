import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/infra/authentication/jwt/jwtAuth.guard';
import { StorageService } from '../services/storage.service';
import { RequestFileUploadDTO } from '../dtos/requestFileUpload.dto';
import { CompleteFileUploadDTO } from '../dtos/completeFileUpload.dto';

@Controller('storages')
export class StorageController {
  constructor(private readonly service: StorageService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/files')
  async getFileList(@Req() req) {
    return await this.service.getFileList(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/files/search')
  async searchFileList(@Req() req, @Query('query') keyword: string) {
    return await this.service.searchFileLIst(req.user.userId, keyword);
  }

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

  @UseGuards(JwtAuthGuard)
  @Post('complete-file-upload')
  async completeFileUpload(@Body() body: CompleteFileUploadDTO) {
    return await this.service.completeFileUpload(body.fileId);
  }
}
