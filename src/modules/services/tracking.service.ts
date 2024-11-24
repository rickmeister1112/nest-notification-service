import { Injectable } from '@nestjs/common';

@Injectable()
export class TrackingService {
  private statusMap: Record<string, any> = {};

  updateStatus(messageId: string, userId: string, status: string) {
    if (!this.statusMap[messageId]) {
      this.statusMap[messageId] = {};
    }
    this.statusMap[messageId][userId] = { status, lastUpdated: new Date() };
  }

  getStatus(messageId: string) {
    return this.statusMap[messageId] || {};
  }
}
