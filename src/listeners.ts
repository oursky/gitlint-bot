import { Context } from "probot";
import Webhooks from "@octokit/webhooks";
import { lintCommitMessage } from "./lint";
import { Commit as GithubCommit } from "types/github";
import { CommitInfo, saveCommit } from "./db";

async function processCommit(githubCommit: GithubCommit): Promise<CommitInfo> {
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
  };
}

export async function onPush(
  context: Context<Webhooks.WebhookPayloadPush>
): Promise<void> {
  const rawCommits = context.payload.commits;
  const commitInfos = await Promise.all(rawCommits.map(processCommit));
  await Promise.all(commitInfos.map(saveCommit));
}
