import { Context } from "probot";
import Webhooks from "@octokit/webhooks";
import { lintCommitMessage } from "./lint";
import { Commit as GithubCommit } from "types/github";

async function processCommit(commit: GithubCommit) {
  const message = commit.message;
  const lintOutput = await lintCommitMessage(message);
  const commitScore = lintOutput.reduce(
    (prevScore, currResult) => prevScore + currResult.score,
    0
  );
  console.log(commitScore);
}

export async function onPush(
  context: Context<Webhooks.WebhookPayloadPush>
): Promise<void> {
  const commits = context.payload.commits;
  await Promise.all(commits.map(processCommit));
}
