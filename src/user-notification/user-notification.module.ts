import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserNotificationMysql } from './user-notification.entity';
import { UserNotificationService } from './user-notification.service';
import { UserNotificationResolver } from './user-notification.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserNotificationMysql])],
  providers: [UserNotificationService, UserNotificationResolver],
})
export class UserNotificationModule {}
