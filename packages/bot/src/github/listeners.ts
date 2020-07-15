import { Context } from "probot";
import Webhooks from "@octokit/webhooks";
import { createGithubFileLoader } from "./config";
import { discoverConfig, applyPresets } from "@oursky/gitlint/lib/config";
import { lintCommitMessage } from "@oursky/gitlint";
import { Commit as GithubCommit } from "../types/github";
import { CommitInfo, saveCommit } from "../db";
import { addInvocationBreadcrumb } from "../sentry";
import { RulesPreset } from "@oursky/gitlint/lib/config/schema";

interface ProcessCommitInfo {
  commit: GithubCommit;
  repoName: string;
}

async function processCommit(
  { commit, repoName }: ProcessCommitInfo,
  preset: RulesPreset
): Promise<CommitInfo> {
  const message = commit.message;
  const { score, violations } = await lintCommitMessage(message, preset);
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
  const fileLoader = createGithubFileLoader(context.github, ref, repoName);
  const config = await discoverConfig(fileLoader);
  const rulesPreset = applyPresets(config);
  const commitInfos = await Promise.all(
    commits.map(async (commit: GithubCommit) => {
      context.log.info(
        {
          repoName: repoName,
          hash: commit.id,
        },
        "received a new commit"
      );
      return processCommit({ commit, repoName }, rulesPreset);
    })
  );
  for (const commitInfo of commitInfos) {
    await saveCommit(commitInfo);
  }
}
