import { Controller, Injectable, OnModuleInit } from "@nestjs/common";
import { DataSource } from 'typeorm';
import {
  DynamoDBClient,
  DescribeTableCommand,
  CreateTableCommand,
} from '@aws-sdk/client-dynamodb';
import { InjectConnection } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { User } from '../entities/mysql/user.entity';
import { MessageSchema } from '../entities/mongo/message.schema'; // MongoDB Message Schema
import { deviceSchema } from '../entities/dynamo/device.schema'; // DynamoDB Schema

@Controller()
@Injectable()
export class BaseController implements OnModuleInit {
  private dynamoDBClient: DynamoDBClient;

  constructor(
    private mysqlDataSource: DataSource, // MySQL data source
    @InjectConnection() private mongoose: Mongoose, // Injected Mongoose connection
  ) {
    this.dynamoDBClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async onModuleInit() {
    console.log(
      'Initializing BaseController: Checking and creating schemas...',
    );
    const schemas = [
      { type: 'mysql', name: 'user', schema: User },
      { type: 'dynamo', name: 'UserDeviceDB', schema: deviceSchema },
      { type: 'mongodb', name: 'Message', schema: MessageSchema },
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
    console.log('BaseController initialization completed.');
  }

  // MongoDB collection check and creation
  async checkAndCreateTableForMongoDB(schema: any, name: string) {
    console.log(`Checking MongoDB collection: ${name}`);
    const collectionExists = await this.mongoose.connection.db
      .listCollections({ name })
      .toArray();

    if (collectionExists.length === 0) {
      console.log(`MongoDB collection ${name} does not exist. Creating...`);
      const model = this.mongoose.model(name, schema);
      // Insert a dummy document to create the collection
      await model.create({
        message_id: 'dummy',
        priority: 'low',
        message_content: 'dummy content',
        is_sent: false,
        scheduled_for_later: new Date(),
      });
      console.log(`MongoDB collection ${name} created successfully.`);
    } else {
      console.log(`MongoDB collection ${name} already exists.`);
    }
  }

  // MySQL table check and creation
  async checkAndCreateTableForMySQL(tableName: string, entity: any) {
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

  // DynamoDB table check and creation
  async checkAndCreateTableForDynamoDB(tableName: string, schema: any) {
    console.log(`Checking DynamoDB table: ${tableName}`);
    try {
      const params = { TableName: tableName };
      const result = await this.dynamoDBClient.send(
        new DescribeTableCommand(params),
      );

      if (!result.Table) {
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
        console.log(`DynamoDB table ${tableName} already exists.`);
      }
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

  // General table/collection check and creation
  async checkAndCreateTable(type: string, name: string, schema: any) {
    if (type === 'mysql') {
      await this.checkAndCreateTableForMySQL(name, schema);
    } else if (type === 'dynamo') {
      await this.checkAndCreateTableForDynamoDB(name, schema);
    } else if (type === 'mongodb') {
      await this.checkAndCreateTableForMongoDB(schema, name);
    }
  }
}