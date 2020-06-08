import { Context } from "probot";
import Webhooks from "@octokit/webhooks";
import { lintCommitMessage } from "./lint";
import { Commit as GithubCommit } from "types/github";

async function processCommit(commit: GithubCommit) {
  const message = commit.message;
  const lintOutput = await lintCommitMessage(message);
  // TODO: save lint results and commit info in db
  console.log(lintOutput.violations);
}

export async function onPush(
  context: Context<Webhooks.WebhookPayloadPush>
): Promise<void> {
  const commits = context.payload.commits;
  await Promise.all(commits.map(processCommit));
}
