import { Context } from "probot";
import Webhooks from "@octokit/webhooks";
import { getConfig } from "./config/index";
import { lintCommitMessage } from "./lint";
import { Commit as GithubCommit } from "./types/github";
import { CommitInfo, saveCommit } from "./db";
import { addInvocationBreadcrumb } from "./sentry";
import { RulesConfig } from "./config/schema";

interface ProcessCommitInfo {
  commit: GithubCommit;
  repoName: string;
}

async function processCommit(
  { commit, repoName }: ProcessCommitInfo,
  config: RulesConfig
): Promise<CommitInfo> {
  const message = commit.message;
  const { score, violations } = await lintCommitMessage(message, config);
  return {
    commit: {
      id: commit.id,
      timestamp: commit.timestamp,
      message,
      score,
      violations,
      url: commit.url,
    },
    author: commit.author,
    repoName,
  };
}

export async function onPush(
  context: Context<Webhooks.WebhookPayloadPush>
): Promise<void> {
  addInvocationBreadcrumb("'onPush' Github Webhook push event handler");
  const { commits, repository, ref } = context.payload;

  const repoName = repository.full_name;
  const config = await getConfig(context.github, repoName, ref);
  const commitInfos = await Promise.all(
    commits.map(async (commit: GithubCommit) => {
      context.log.info(
        {
          repoName: repoName,
          hash: commit.id,
        },
        "received a new commit"
      );
      return processCommit({ commit, repoName }, config);
    })
  );
  for (const commitInfo of commitInfos) {
    await saveCommit(commitInfo);
  }
}
