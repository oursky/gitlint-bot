import { Context } from "probot";
import Webhooks from "@octokit/webhooks";
import { getConfig } from "./config/index";
import { lintCommitMessage } from "./lint";
import { Commit as GithubCommit } from "./types/github";
import { CommitInfo, saveCommit } from "./db";
import { addInvocationBreadcrumb } from "./sentry";

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
      url: githubCommit.url,
    },
    author: githubCommit.author,
    repoName,
  };
}

export async function onPush(
  context: Context<Webhooks.WebhookPayloadPush>
): Promise<void> {
  addInvocationBreadcrumb("'onPush' Github Webhook push event handler");
  const { commits, repository, ref } = context.payload;

  const repoName = repository.full_name;
  await getConfig(context.github, repoName, ref);
  const commitInfos = await Promise.all(
    commits.map(async (commit: GithubCommit) => {
      context.log.info(
        {
          repoName: repoName,
          hash: commit.id,
        },
        "received a new commit"
      );
      return processCommit(commit, repoName);
    })
  );
  for (const commitInfo of commitInfos) {
    await saveCommit(commitInfo);
  }
}
