import { Controller, Post, Body } from '@nestjs/common';
import { MessageService } from '../modules/services/message.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/send')
  async sendMessage(
    @Body() body: { content: string; userIds: string[]; priority: number },
  ) {
    return this.messageService.createMessage(
      body.content,
      body.userIds,
      body.priority,
    );
  }
}
