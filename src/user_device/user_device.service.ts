import { Injectable } from '@nestjs/common';
import {
  DynamoDBClient,
  PutItemCommand,
  DeleteItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { deviceSchema } from './device.schema';

@Injectable()
export class UserDeviceService {
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

  async addDevice(userId: string, deviceId: string): Promise<void> {
    const params = {
      TableName: deviceSchema.TableName,
      Item: {
        userId: { S: userId },
        deviceId: { S: deviceId },
      },
    };

    await this.dynamoDBClient.send(new PutItemCommand(params));
  }

  async removeDevice(userId: string, deviceId: string): Promise<boolean> {
    const params = {
      TableName: deviceSchema.TableName,
      Key: {
        userId: { S: userId },
        deviceId: { S: deviceId },
      },
    };

    await this.dynamoDBClient.send(new DeleteItemCommand(params));
    return true;
  }

  async getDevicesByUserId(
    userId: string,
  ): Promise<{ userId: string; deviceId: string }[]> {
    const params = {
      TableName: deviceSchema.TableName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': { S: userId },
      },
    };

    const result = await this.dynamoDBClient.send(new QueryCommand(params));
    return (
      result.Items?.map((item) => ({
        userId: item.userId.S,
        deviceId: item.deviceId.S,
      })) || []
    );
  }

  async getDeviceCountByUserId(userId: string): Promise<number> {
    const devices = await this.getDevicesByUserId(userId);
    return devices.length;
  }
}
