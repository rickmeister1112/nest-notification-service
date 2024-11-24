import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TrackingService } from '../modules/services/tracking.service';

@Processor('smsQueue')
export class SmsProcessor {
  constructor(private readonly trackingService: TrackingService) {}

  @Process()
  async handleSms(job: Job) {
    // Logic for handling sms notifications will go here
    const { messageId, userId, content } = job.data;
    try {
      // Simulate sending email
      console.log(`Sending SMS to ${userId}: ${content}`);
      this.trackingService.updateStatus(messageId, userId, 'SENT');
    } catch (error) {
      this.trackingService.updateStatus(messageId, userId, 'FAILED');
      console.log(error);
    }
  }
}
