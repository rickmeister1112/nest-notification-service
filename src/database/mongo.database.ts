import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb://localhost:27017/notification_service',
    ), // MongoDB URI in .env
  ],
  exports: [MongooseModule],
})
export class MongoDBModule {}
