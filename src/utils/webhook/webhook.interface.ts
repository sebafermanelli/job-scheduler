export interface WebhookServiceInterface {
  /**
   * Send a webhook to the given URL with the given payload.
   * @param webhookUrl - The URL to send the webhook to.
   * @param payload - The payload to send in the webhook (request body).
   * @returns The response from the webhook.
   */
  sendWebhook(webhookUrl: string, payload: object): Promise<any>;
}
