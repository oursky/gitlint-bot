import { Context } from "probot";
import Webhooks from "@octokit/webhooks";
import { lintCommitMessage, LintResults } from "./lint";
import { Commit as GithubCommit } from "types/github";

export async function onPush(
  context: Context<Webhooks.WebhookPayloadPush>
): Promise<void> {
  const commits = context.payload.commits;
  const messages = commits.map((commit: GithubCommit) => commit.message);
  const lintOutput: LintResults[] = await Promise.all(
    messages.map(lintCommitMessage)
  );
  const commitScores: number[] = lintOutput.map((result: LintResults) =>
    result.reduce((prevScore, currResult) => prevScore + currResult.score, 0)
  );
  console.log(commitScores);
}
