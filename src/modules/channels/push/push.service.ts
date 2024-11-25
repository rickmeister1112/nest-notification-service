import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  ScanCommand,
  ScanCommandInput,
} from '@aws-sdk/client-dynamodb';

@Injectable()
export class PushService {
  private dynamoDBClient: DynamoDBClient;

  constructor() {
    this.dynamoDBClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  /**
   * Fetch all device IDs for a given userId.
   * @param userId - The userId to query.
   * @returns A list of device IDs.
   */
  async getDeviceIds(userId: string): Promise<string[]> {
    const params: ScanCommandInput = {
      TableName: process.env.DYNAMO_DEVICE_TABLE || 'DeviceDB',
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': { S: userId },
      },
    };

    try {
      const response = await this.dynamoDBClient.send(new ScanCommand(params));
      if (!response.Items) {
        return [];
      }

      // Extract deviceIds from the result
      return response.Items.map((item) => item.deviceId.S);
    } catch (error) {
      console.error('Error fetching device IDs:', error.message);
      throw new Error('Could not fetch device IDs.');
    }
  }

  /**
   * Send push notifications to the given devices.
   * @param deviceIds - List of device IDs to send notifications to.
   * @param message - The notification message to send.
   * @returns Status of the notification send.
   */
  async sendPushNotification(
    deviceIds: string[],
    message: string,
  ): Promise<void> {
    if (!deviceIds.length) {
      console.log('No devices to send push notifications to.');
      return;
    }

    // Simulate sending push notifications
    deviceIds.forEach((deviceId) => {
      console.log(`Sending push notification to DeviceID: ${deviceId}`);
      console.log(`Message: ${message}`);
    });

    console.log('Push notifications sent successfully.');
  }

  /**
   * Handles fetching devices and sending notifications for a given userId.
   * @param userId - The userId to fetch devices for and send notifications.
   * @param message - The notification message.
   */
  async notifyUser(userId: string, message: string): Promise<void> {
    try {
      console.log(`Fetching devices for userId: ${userId}`);
      const deviceIds = await this.getDeviceIds(userId);

      console.log(`Sending notifications to userId: ${userId}`);
      await this.sendPushNotification(deviceIds, message);
    } catch (error) {
      console.error(`Error notifying user (${userId}):`, error.message);
      throw new Error(`Failed to send push notifications to user (${userId}).`);
    }
  }
}
