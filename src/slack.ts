import { IncomingWebhook } from "@slack/webhook";
import { SLACK_WEBHOOK_URL, SLACK_DAY_INTERVAL } from "./config";

interface SendSlackSummaryParams {
  numCommits: number;
  numCommitDiagnoses: number;
}
const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

export async function sendSlackSummary({
  numCommits,
  numCommitDiagnoses,
}: SendSlackSummaryParams): Promise<void> {
  await webhook.send({
    blocks: [
      {
        type: "section",
        text: {
          type: "plain_text",
          text: `In the past ${SLACK_DAY_INTERVAL} days, there were a total of ${numCommits} analyzed commits with ${numCommitDiagnoses} rule violations`,
        },
      },
    ],
  });
}
