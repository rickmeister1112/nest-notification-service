import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TrackingService } from '../modules/services/tracking.service';

@Processor('emailQueue')
export class EmailProcessor {
  constructor(private readonly trackingService: TrackingService) {}

  @Process()
  async sendEmail(job: Job) {
    const { messageId, userId, content } = job.data;
    try {
      // Simulate sending email
      console.log(`Sending email to ${userId}: ${content}`);
      this.trackingService.updateStatus(messageId, userId, 'SENT');
    } catch (error) {
      this.trackingService.updateStatus(messageId, userId, 'FAILED');
      console.log(error);
    }
  }
}
