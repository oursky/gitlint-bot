import { IncomingWebhook } from "@slack/webhook";
import { CommitWithDiagnoses } from "./db";
import { parseCommit } from "./lint/parser";
import { Commit } from "./db/models/Commit";
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

async function getCommitSubjectLine(commit: Commit): Promise<string> {
  const parsedCommit = await parseCommit(commit.message);
  return parsedCommit.header;
}

async function createTopCommitsBlock(topCommits: CommitWithDiagnoses[]) {
  const commitCount = topCommits.length;
  const header = `*Top ${commitCount} commit messages with highest lint violation scores:*\n`;
  const messageBody = (
    await Promise.all(
      topCommits.map(async (commit) => {
        const subjectLine = await getCommitSubjectLine(commit);
        const paddedScore = String(commit.score).padEnd(3, " ");
        const shortId = commit.id.slice(0, 8);

        const messageComponents: string[] = [
          `• Score: ${paddedScore} | ${commit.repo_name}@<${commit.url}|${shortId}> | "${subjectLine}"`,
        ];
        commit.diagnoses.forEach((diagnosis) => {
          messageComponents.push(`\t• \`${diagnosis.rule}\``);
        });
        return messageComponents.join("\n");
      })
    )
  ).join("\n");
  return createMarkdownSection(header + messageBody);
}

export async function sendSlackSummary({
  topCommits,
}: SendSlackSummaryParams): Promise<void> {
  const summaryHeaderBlock = createMarkdownSection(
    "Weekly commit message lint summary (Published on Friday at 5pm)"
  );
  const filteredTopCommits = topCommits.filter((commit) => commit.score > 0);
  const topCommitsBlock = await createTopCommitsBlock(filteredTopCommits);
  await webhook.send({
    blocks: [summaryHeaderBlock, dividerBlock, topCommitsBlock],
  });
}
