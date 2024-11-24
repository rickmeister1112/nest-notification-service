import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MessageService {
  constructor(@InjectQueue('mainQueue') private readonly mainQueue: Queue) {}

  async createMessage(content: string, userIds: string[], priority: number) {
    const messageId = this.generateMessageId();
    await this.mainQueue.add('processMessage', {
      messageId,
      content,
      userIds,
      priority,
    });
    return { messageId, status: 'QUEUED' };
  }

  private generateMessageId(): string {
    return uuidv4();
  }
}
