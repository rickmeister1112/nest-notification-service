// src/schemas/message.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Message extends Document {
  @Prop({ required: true })
  message_id: string;

  @Prop({ required: true })
  priority: string;

  @Prop({ required: true })
  message_content: string;

  @Prop({ default: false })
  is_sent: boolean;

  @Prop({ required: false })
  scheduled_for_later: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
