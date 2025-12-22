import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [UserModule, StorageModule],
})
export class AppModule {}
