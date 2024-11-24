import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserDeviceService } from './user_device.service';
import { UserDevice } from './user_device.entity';

@Resolver(() => UserDevice)
export class UserDeviceResolver {
  constructor(private readonly userDeviceService: UserDeviceService) {}

  @Query(() => [UserDevice])
  async getDevicesByUserId(
    @Args('userId') userId: string,
  ): Promise<UserDevice[]> {
    return this.userDeviceService.getDevicesByUserId(userId);
  }

  @Query(() => Number)
  async getDeviceCountByUserId(
    @Args('userId') userId: string,
  ): Promise<number> {
    return this.userDeviceService.getDeviceCountByUserId(userId);
  }

  @Mutation(() => UserDevice)
  async addDevice(
    @Args('userId') userId: string,
    @Args('deviceId') deviceId: string,
  ): Promise<UserDevice> {
    await this.userDeviceService.addDevice(userId, deviceId);
    return { userId, deviceId };
  }

  @Mutation(() => Boolean)
  async removeDevice(
    @Args('userId') userId: string,
    @Args('deviceId') deviceId: string,
  ): Promise<boolean> {
    return this.userDeviceService.removeDevice(userId, deviceId);
  }
}
