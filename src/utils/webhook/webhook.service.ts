import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { WebhookServiceInterface } from './webhook.service.interface';

@Injectable()
export class WebhookService implements WebhookServiceInterface {
  constructor(private readonly httpService: HttpService) {}

  async sendWebhook(webhookUrl: string, payload: object): Promise<any> {
    try {
      Logger.log(`Sending webhook to ${webhookUrl} 📡`, WebhookService.name);
      const response = await this.httpService.axiosRef.post(
        webhookUrl,
        payload,
      );
      Logger.log(
        `Webhook sent successfully to ${webhookUrl} 📡`,
        WebhookService.name,
      );
      return response.data;
    } catch (error) {
      Logger.error(
        `Failed to send webhook to ${webhookUrl} 🚨: ${error.message}`,
        WebhookService.name,
      );
      throw error;
    }
  }
}
