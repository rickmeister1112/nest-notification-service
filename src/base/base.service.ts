import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  DynamoDBClient,
  DescribeTableCommand,
  CreateTableCommand,
} from '@aws-sdk/client-dynamodb';
import { InjectConnection } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { UserNotificationMysql } from '../modules/user-notification/user-notification.entity';
import { MessageSchema } from '../entities/mongo/message.schema';
import { deviceSchema } from '../modules/user_device/device.schema';
import { UserNotificationSchema } from '../entities/mongo/usernotification.schema';
import { VendorEntity } from '../modules/vendor/vendor.entity';

@Injectable()
export class BaseControllerService {
  private dynamoDBClient: DynamoDBClient;

  constructor(
    private mysqlDataSource: DataSource,
    @InjectConnection() private mongoose: Mongoose,
  ) {
    this.dynamoDBClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async initializeSchemas() {
    const schemas = [
      { type: 'mysql', name: 'user', schema: UserNotificationMysql },
      { type: 'dynamo', name: 'UserDeviceDB', schema: deviceSchema },
      { type: 'mongodb', name: 'Message', schema: MessageSchema },
      {
        type: 'mongodb',
        name: 'UserNotification',
        schema: UserNotificationSchema,
      },
      { type: 'mysql', name: 'vendor', schema: VendorEntity },
    ];

    for (const schema of schemas) {
      try {
        console.log(`Processing ${schema.type} schema: ${schema.name}`);
        await this.checkAndCreateTable(schema.type, schema.name, schema.schema);
      } catch (error) {
        console.error(
          `Error processing ${schema.type} schema (${schema.name}): ${error.message}`,
        );
      }
    }
  }

  private async checkAndCreateTable(
    type: string,
    name: string,
    schema: any,
  ): Promise<void> {
    if (type === 'mysql') {
      await this.checkAndCreateTableForMySQL(name, schema);
    } else if (type === 'dynamo') {
      await this.checkAndCreateTableForDynamoDB(name, schema);
    } else if (type === 'mongodb') {
      await this.checkAndCreateTableForMongoDB(name, schema);
    }
  }

  private async checkAndCreateTableForMySQL(
    tableName: string,
    entity: any,
  ): Promise<void> {
    console.log(`Checking MySQL table: ${tableName}`);
    const tableExists = await this.mysqlDataSource
      .getRepository(entity)
      .query(`SHOW TABLES LIKE '${tableName}'`);

    if (tableExists.length === 0) {
      console.log(`MySQL table ${tableName} does not exist. Creating...`);
      await this.mysqlDataSource.synchronize();
      console.log(`MySQL table ${tableName} created successfully.`);
    } else {
      console.log(`MySQL table ${tableName} already exists.`);
    }
  }

  private async checkAndCreateTableForDynamoDB(
    tableName: string,
    schema: any,
  ): Promise<void> {
    console.log(`Checking DynamoDB table: ${tableName}`);
    try {
      await this.dynamoDBClient.send(
        new DescribeTableCommand({ TableName: tableName }),
      );
      console.log(`DynamoDB table ${tableName} already exists.`);
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        console.log(`DynamoDB table ${tableName} does not exist. Creating...`);
        await this.dynamoDBClient.send(
          new CreateTableCommand({
            TableName: tableName,
            KeySchema: schema.KeySchema,
            AttributeDefinitions: schema.AttributeDefinitions,
            ProvisionedThroughput: schema.ProvisionedThroughput,
          }),
        );
        console.log(`DynamoDB table ${tableName} created successfully.`);
      } else {
        console.error(
          `Error checking DynamoDB table (${tableName}): ${error.message}`,
        );
      }
    }
  }

  private async checkAndCreateTableForMongoDB(
    collectionName: string,
    schema: any,
  ): Promise<void> {
    if (this.mongoose.connection.readyState !== 1) {
      console.error('MongoDB connection is not yet established.');
      return;
    }

    console.log(`Checking MongoDB collection: ${collectionName}`);
    const collectionExists = await this.mongoose.connection.db
      .listCollections({ name: collectionName })
      .toArray();

    if (collectionExists.length === 0) {
      console.log(
        `MongoDB collection ${collectionName} does not exist. Creating...`,
      );
      this.mongoose.model(collectionName, schema);
      console.log(`MongoDB collection ${collectionName} created successfully.`);
    } else {
      console.log(`MongoDB collection ${collectionName} already exists.`);
    }
  }
}
