import { Context } from "probot";
import Webhooks from "@octokit/webhooks";
import { lintCommitMessage, ViolationInfo } from "./lint";
import { Commit as GithubCommit, CommitUser } from "types/github";
import { createCommitDiagnosis } from "./db/models/CommitDiagnosis";
import { createCommit, findCommit } from "./db/models/Commit";
import { findOrCreateUser } from "./db/models/User";

interface CommitInfo {
  author: CommitUser;
  commit: {
    id: string;
    message: string;
    score: number;
    timestamp: string;
    violations: ViolationInfo[];
  };
}

async function saveCommit(commitInfo: CommitInfo) {
  const commitExists = await findCommit(commitInfo.commit.id);
  if (!!commitExists) {
    return;
  }
  const user = await findOrCreateUser(commitInfo.author.name);

  const { id, message, score, timestamp, violations } = commitInfo.commit;
  const commit = await createCommit({
    id,
    user_id: user.id,
    committed_at: timestamp,
    score,
    message,
  });
  await Promise.all(
    violations.map(async (violation) =>
      createCommitDiagnosis({
        commit_id: commit.id,
        rule: violation.ruleName,
        data: violation.violation,
      })
    )
  );
}

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
