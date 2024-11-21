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
import { User } from './entities/mysql/user.entity';
import * as dotenv from 'dotenv';
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
      entities: [User],
      synchronize: true,
    }),
    // Log the MongoDB URI to check if it's being loaded correctly
    MongooseModule.forRoot('mongodb://localhost:27017/notification_service'),
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: UserNotification.name, schema: UserNotificationSchema },
    ]),
  ],
  controllers: [AppController, BaseController],
  providers: [AppService, DynamoDatabaseService],
})
export class AppModule {}
