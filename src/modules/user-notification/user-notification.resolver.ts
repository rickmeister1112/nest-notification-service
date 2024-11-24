import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserNotificationService } from './user-notification.service';
import { UserNotificationMysql } from './user-notification.entity';

@Resolver(() => UserNotificationMysql)
export class UserNotificationResolver {
  constructor(
    private readonly userNotificationService: UserNotificationService,
  ) {}
  // Query to get user notification preferences
  @Query(() => UserNotificationMysql)
  async getUserNotification(
    @Args('userId') userId: string,
  ): Promise<UserNotificationMysql> {
    return this.userNotificationService.getUserNotification(userId);
  }

  // Mutation to add user notification preferences
  @Mutation(() => UserNotificationMysql)
  async addUserNotification(
    @Args('userId') userId: string,
    @Args('pushNotificationEnabled') pushNotificationEnabled: boolean,
    @Args('emailEnabled') emailEnabled: boolean,
    @Args('smsEnabled') smsEnabled: boolean,
    @Args('isBlacklisted') isBlacklisted: boolean,
  ): Promise<UserNotificationMysql> {
    return this.userNotificationService.addUserNotification(userId, {
      pushNotificationEnabled,
      emailEnabled,
      smsEnabled,
      isBlacklisted,
    });
  }
  // Mutation to update user notification preferences
  @Mutation(() => UserNotificationMysql)
  async updateUserNotification(
    @Args('userId') userId: string,
    @Args('pushNotificationEnabled') pushNotificationEnabled: boolean,
    @Args('emailEnabled') emailEnabled: boolean,
    @Args('smsEnabled') smsEnabled: boolean,
    @Args('isBlacklisted') isBlacklisted: boolean,
  ): Promise<UserNotificationMysql> {
    return this.userNotificationService.updateUserNotification(userId, {
      pushNotificationEnabled,
      emailEnabled,
      smsEnabled,
      isBlacklisted,
    });
  }
  @Query(() => [UserNotificationMysql])
  async getAllUsers(): Promise<UserNotificationMysql[]> {
    return this.userNotificationService.getAllUsers();
  }
}
