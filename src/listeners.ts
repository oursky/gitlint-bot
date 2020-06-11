import { Context } from "probot";
import Webhooks from "@octokit/webhooks";
import { lintCommitMessage } from "./lint";
import { Commit as GithubCommit } from "types/github";
import { findOrCreateUser } from "./models/User";
import { createCommit, findCommit } from "./models/Commit";
import { createCommitDiagnosis } from "./models/CommitDiagnosis";

async function processCommit(githubCommit: GithubCommit): Promise<void> {
  const commitExists = await findCommit(githubCommit.id);
  if (!!commitExists) {
    return;
  }
  const message = githubCommit.message;
  const { score, violations } = await lintCommitMessage(message);
  const userName = githubCommit.author.name;
  const user = await findOrCreateUser(userName);
  const commit = await createCommit({
    id: githubCommit.id,
    user_id: user.id,
    committed_at: githubCommit.timestamp,
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

export async function onPush(
  context: Context<Webhooks.WebhookPayloadPush>
): Promise<void> {
  const commits = context.payload.commits;
  await Promise.all(commits.map(processCommit));
}
