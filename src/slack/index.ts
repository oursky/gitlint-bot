import { IncomingWebhook } from "@slack/webhook";
import { CommitWithDiagnoses } from "../db";
import { SLACK_WEBHOOK_URL } from "../config";
import { createMarkdownSection, dividerBlock } from "./utils";
import { createTopCommitsSection } from "./sections/topCommits";

interface SendSlackSummaryParams {
  topCommits: CommitWithDiagnoses[];
}
const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

export async function sendSlackSummary({
  topCommits,
}: SendSlackSummaryParams): Promise<void> {
  const summaryHeaderSection = createMarkdownSection(
    "Weekly commit message lint summary (Published on Friday at 5pm)"
  );
  const filteredTopCommits = topCommits.filter((commit) => commit.score > 0);
  const topCommitsSection = await createTopCommitsSection(filteredTopCommits);
  await webhook.send({
    blocks: [summaryHeaderSection, dividerBlock, topCommitsSection],
  });
}
