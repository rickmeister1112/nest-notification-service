import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { Message } from '../entities/mongo/message.schema';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { UserNotificationService } from '../modules/user-notification/user-notification.service'; // Assuming you have a UserService to fetch all users

@Injectable()
export class NotificationSchedulerService {
  private readonly logger = new Logger(NotificationSchedulerService.name);

  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    @InjectQueue('mainQueue') private readonly mainQueue: Queue,
    private readonly userService: UserNotificationService, // Injecting UserService to get all users
  ) {}

  // Cron job to check for scheduled messages every minute
  @Cron('*/1 * * * *') // Every minute
  async checkScheduledMessages() {
    const currentTime = new Date();

    // Find messages that are scheduled for later and have not been sent
    const scheduledMessages = await this.messageModel.find({
      scheduled_for_later: { $lte: currentTime }, // Scheduled for the current time or earlier
      is_sent: false, // Only unsent messages
    });

    if (scheduledMessages.length === 0) {
      this.logger.log('No scheduled messages to send.');
    } else {
      this.logger.log(
        `Found ${scheduledMessages.length} scheduled message(s).`,
      );

      for (const message of scheduledMessages) {
        // Fetch all userIds
        const allUsers = await this.userService.getAllUsers(); // Assuming you have this method
        const userIds = allUsers.map((user) => user.userId); // Extracting user_ids

        // Add the message to the queue for all users
        await this.mainQueue.add('processMessage', {
          messageId: message.message_id,
          content: message.message_content,
          userIds, // Send to all users
          priority: message.priority, // Ensure that priority is maintained
        });

        // Mark the message as sent in MongoDB
        message.is_sent = true;
        await message.save();
      }
    }
  }
}
