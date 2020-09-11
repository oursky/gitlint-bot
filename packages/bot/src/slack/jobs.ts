import { IncomingWebhook } from "@slack/webhook";
import { SLACK_DAY_INTERVAL, SLACK_WEBHOOK_URL } from "../env";
import { createSlackSummaryMessage } from "./summary";

const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

export async function summaryJob(
  durationDays: number = SLACK_DAY_INTERVAL
): Promise<void> {
  const message = await createSlackSummaryMessage(durationDays);
  await webhook.send({
    blocks: message,
  });
}
