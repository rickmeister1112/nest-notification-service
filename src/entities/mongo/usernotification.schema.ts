// src/schemas/user-notification.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserNotification extends Document {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  notification_type: string;

  @Prop({ required: true })
  notification_content: string;

  @Prop({ default: false })
  is_read: boolean;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const UserNotificationSchema =
  SchemaFactory.createForClass(UserNotification);
