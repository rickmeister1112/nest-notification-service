import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TrackingService } from '../modules/services/tracking.service';

@Processor('whatsappQueue')
export class WhatsappProcessor {
  constructor(private readonly trackingService: TrackingService) {}

  @Process()
  async handleWhatsapp(job: Job) {
    // Logic for handling WhatsApp notifications will go here
    const { messageId, userId, content } = job.data;
    try {
      // Simulate sending email
      console.log(`Sending WhatsApp to ${userId}: ${content}`);
      this.trackingService.updateStatus(messageId, userId, 'SENT');
    } catch (error) {
      this.trackingService.updateStatus(messageId, userId, 'FAILED');
      console.log(error);
    }
  }
}
