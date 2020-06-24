import { IncomingWebhook } from "@slack/webhook";
import { CommitWithDiagnoses } from "./db";
import { SLACK_WEBHOOK_URL } from "./config";
import { SectionBlock, DividerBlock } from "@slack/types";

interface SendSlackSummaryParams {
  topCommits: CommitWithDiagnoses[];
}
const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

const dividerBlock: DividerBlock = {
  type: "divider",
};

function createMarkdownSection(text: string): SectionBlock {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text,
    },
  };
}

function createTopCommitsBlock(topCommits: CommitWithDiagnoses[]) {
  const header =
    "*Top 10 commit messages with highest lint violation scores:*\n";
  const messageBody = topCommits
    .map((commit) => {
      const paddedScore = String(commit.score).padEnd(3, " ");
      const shortId = commit.id.slice(0, 8);

      const messageComponents: string[] = [
        `• Score: ${paddedScore} | ${commit.repo_name}: <${commit.url}|${shortId}>`,
      ];
      commit.diagnoses.forEach((diagnosis) => {
        messageComponents.push(`\t• \`${diagnosis.rule}\``);
      });
      return messageComponents.join("\n");
    })
    .join("\n");
  return createMarkdownSection(header + messageBody);
}

export async function sendSlackSummary({
  topCommits,
}: SendSlackSummaryParams): Promise<void> {
  const summaryHeaderBlock = createMarkdownSection(
    "Weekly commit message lint summary (Published on Friday at 5pm)"
  );
  const topCommitsBlock = createTopCommitsBlock(topCommits);
  await webhook.send({
    blocks: [summaryHeaderBlock, dividerBlock, topCommitsBlock],
  });
}
