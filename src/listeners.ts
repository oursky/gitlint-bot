import { Context } from "probot";
import Webhooks from "@octokit/webhooks";
import { lintCommitMessage } from "./lint";
import { Commit as GithubCommit } from "types/github";
import { CommitInfo, saveCommit } from "./db";

async function processCommit(
  githubCommit: GithubCommit,
  ref: string,
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
    ref,
  };
}

export async function onPush(
  context: Context<Webhooks.WebhookPayloadPush>
): Promise<void> {
  const { commits, ref, repository } = context.payload;
  const commitInfos = await Promise.all(
    commits.map(async (commit) =>
      processCommit(commit, ref, repository.full_name)
    )
  );
  for (const commitInfo of commitInfos) {
    await saveCommit(commitInfo);
  }
}
