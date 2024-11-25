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
import { BaseControllerModule } from './base/base.module';
import { PushModule } from './modules/channels/push/push.module';
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
    MongooseModule.forRoot('mongodb://localhost:27017/notification_service'),
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: UserNotification.name, schema: UserNotificationSchema },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      playground: true,
    }),
    UserNotificationModule,
    VendorModule,
    UserDeviceModule,
    BaseControllerModule,
    PushModule,
  ],
  controllers: [AppController, BaseController],
  providers: [AppService, DynamoDatabaseService, BaseController],
})
export class AppModule {}
