import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseController } from './base/base.controller';
import { DynamoDatabaseService } from './database/dynamo.database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message, MessageSchema } from './entities/mongo/message.schema';
import {
  UserNotification,
  UserNotificationSchema,
} from './entities/mongo/usernotification.schema';
import { UserNotificationMysql } from './modules/user-notification/user-notification.entity';
import * as dotenv from 'dotenv';
import { GraphQLModule } from '@nestjs/graphql';
import { UserNotificationModule } from './modules/user-notification/user-notification.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { VendorModule } from './modules/vendor/vendor.module';
import { VendorEntity } from './modules/vendor/vendor.entity';
import { UserDeviceModule } from './modules/user_device/user_device.module';
import { BullModule } from '@nestjs/bull';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_PORT,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DB,
      entities: [UserNotificationMysql, VendorEntity],
      synchronize: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'main',
    }),
    // Log the MongoDB URI to check if it's being loaded correctly
    MongooseModule.forRoot('mongodb://localhost:27017/notification_service'),
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: UserNotification.name, schema: UserNotificationSchema },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver, // Add the ApolloDriver
      autoSchemaFile: 'schema.gql', // Automatically generate schema file
      playground: true, // Enable GraphQL playground in development
    }),
    UserNotificationModule,
    VendorModule,
    UserDeviceModule,
  ],
  controllers: [AppController, BaseController],
  providers: [AppService, DynamoDatabaseService, BaseController],
})
export class AppModule {}
