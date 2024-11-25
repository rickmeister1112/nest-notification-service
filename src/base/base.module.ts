import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseController } from './base.controller';
import { BaseControllerService } from './base.service';
import { UserNotificationMysql } from '../modules/user-notification/user-notification.entity';
import { VendorEntity } from '../modules/vendor/vendor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserNotificationMysql, VendorEntity]),
    MongooseModule.forFeature([]), // Add schemas if needed
  ],
  controllers: [BaseController],
  providers: [BaseControllerService],
  exports: [BaseControllerService],
})
export class BaseControllerModule {}
