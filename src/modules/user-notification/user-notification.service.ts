import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserNotificationMysql } from './user-notification.entity';

@Injectable()
export class UserNotificationService {
  constructor(
    @InjectRepository(UserNotificationMysql)
    private userNotificationRepository: Repository<UserNotificationMysql>,
  ) {}

  // Add new user notification preferences
  async addUserNotification(
    userId: string,
    preferences: Partial<UserNotificationMysql>,
  ): Promise<UserNotificationMysql> {
    const userNotification = this.userNotificationRepository.create({
      userId,
      ...preferences,
    });
    return this.userNotificationRepository.save(userNotification);
  }

  // Update user notification preferences
  async updateUserNotification(
    userId: string,
    updateData: Partial<UserNotificationMysql>,
  ): Promise<UserNotificationMysql> {
    const userNotification = await this.userNotificationRepository.findOne({
      where: { userId },
    });
    if (userNotification) {
      Object.assign(userNotification, updateData);
      return this.userNotificationRepository.save(userNotification);
    }
    throw new Error('User notification settings not found');
  }

  // Get user notification preferences
  async getUserNotification(userId: string): Promise<UserNotificationMysql> {
    return this.userNotificationRepository.findOne({ where: { userId } });
  }

  async getAllUsers(): Promise<UserNotificationMysql[]> {
    return this.userNotificationRepository.find();
  }
}
