import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DynamoDatabaseService {
  private readonly dynamoDBClient: DynamoDBClient;

  constructor() {
    // Initialize the DynamoDB Client with AWS credentials and region
    this.dynamoDBClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  // Getter method to access the client from other parts of the app
  getClient() {
    return this.dynamoDBClient;
  }
}
