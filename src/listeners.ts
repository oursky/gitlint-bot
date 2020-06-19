import { Context } from "probot";
import Webhooks from "@octokit/webhooks";
import { lintCommitMessage } from "./lint";
import { Commit as GithubCommit } from "types/github";
import { CommitInfo, saveCommit } from "./db";
import { addInvocationBreadcrumb } from "./logger";

async function processCommit(
  githubCommit: GithubCommit,
  repoName: string
): Promise<CommitInfo> {
  const message = githubCommit.message;
  const { score, violations } = await lintCommitMessage(message);
  return {
    commit: {
      id: githubCommit.id,
      timestamp: githubCommit.timestamp,
      message,
      score,
      violations,
    },
    author: githubCommit.author,
    repoName,
  };
}

export async function onPush(
  context: Context<Webhooks.WebhookPayloadPush>
): Promise<void> {
  addInvocationBreadcrumb("'onPush' Github Webhook push event handler");
  const { commits, repository } = context.payload;
  const commitInfos = await Promise.all(
    commits.map(async (commit) => processCommit(commit, repository.full_name))
  );
  for (const commitInfo of commitInfos) {
    await saveCommit(commitInfo);
  }
}
