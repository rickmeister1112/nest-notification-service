import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TrackingService } from '../modules/services/tracking.service';

@Processor('pushQueue')
export class PushProcessor {
  constructor(private readonly trackingService: TrackingService) {}

  @Process()
  async handlePush(job: Job) {
    // Logic for handling push notifications will go here
    const { messageId, userId, content } = job.data;
    try {
      // Simulate sending email
      console.log(`Sending notification to ${userId}: ${content}`);
      this.trackingService.updateStatus(messageId, userId, 'SENT');
    } catch (error) {
      this.trackingService.updateStatus(messageId, userId, 'FAILED');
      console.log(error);
    }
  }
}
