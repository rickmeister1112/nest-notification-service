import { Module } from '@nestjs/common';
import { UserDeviceResolver } from './user_device.resolver';
import { UserDeviceService } from './user_device.service';

@Module({
  providers: [UserDeviceResolver, UserDeviceService],
})
export class UserDeviceModule {}
