import { IncomingWebhook } from "@slack/webhook";
import { SLACK_WEBHOOK_URL } from "./config";

const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

export async function sendSlackSummary(): Promise<void> {
  await webhook.send({
    text: "Sample commit summary message",
  });
}
