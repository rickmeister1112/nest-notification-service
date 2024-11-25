import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { UserNotificationService } from '../user-notification/user-notification.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { UserNotificationMysql } from '../user-notification/user-notification.entity';

@Processor('mainQueue')
export class MainQueueProcessor {
  constructor(
    private readonly userNotificationService: UserNotificationService,
    @InjectQueue('emailQueue') private readonly emailQueue: Queue,
    @InjectQueue('smsQueue') private readonly smsQueue: Queue,
    @InjectQueue('pushQueue') private readonly pushQueue: Queue,
  ) {}
  async getUserPreferences(userId: string): Promise<UserNotificationMysql> {
    const preferences =
      await this.userNotificationService.getUserNotification(userId);
    if (!preferences) {
      throw new Error(`Preferences not found for user ${userId}`);
    }
    return preferences;
  }
  @Process('processMessage')
  async handleMainQueue(job: Job) {
    const { messageId, content, userIds, priority } = job.data;

    for (const userId of userIds) {
      try {
        const preferences = await this.getUserPreferences(userId);

        if (preferences.emailEnabled) {
          await this.emailQueue.add({ messageId, userId, content, priority });
        }
        if (preferences.smsEnabled) {
          await this.smsQueue.add({ messageId, userId, content, priority });
        }
        if (preferences.pushNotificationEnabled) {
          await this.pushQueue.add({ messageId, userId, content, priority });
        }
      } catch (error) {
        console.error(`Error processing message for user ${userId}:`, error);
        // Optionally, track failures or retry the job
        // we will use kafka so the dead letter queue will help
      }
    }
  }
}
