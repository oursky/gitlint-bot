import { IncomingWebhook } from "@slack/webhook";
import { CommitWithDiagnoses } from "../db";
import { SLACK_WEBHOOK_URL } from "../env";
import { createMarkdownSection, dividerBlock } from "./utils";
import { createTopCommitsSection } from "./sections/topCommits";

interface SendSlackSummaryParams {
  topCommits: CommitWithDiagnoses[];
  durationDays: number;
}
const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

export async function sendSlackSummary({
  topCommits,
  durationDays,
}: SendSlackSummaryParams): Promise<void> {
  const summaryHeaderSection = createMarkdownSection(
    `Commit message lint summary for past ${durationDays} days`
  );
  const filteredTopCommits = topCommits.filter((commit) => commit.score > 0);
  const topCommitsSection = await createTopCommitsSection(filteredTopCommits);
  await webhook.send({
    blocks: [summaryHeaderSection, dividerBlock, topCommitsSection],
  });
}
