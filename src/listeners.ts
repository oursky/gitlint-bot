import { Context } from "probot";
import Webhooks from "@octokit/webhooks";
import { lintCommit, LintResults } from "./lint";

interface GithubCommit {
  message: string;
}

export async function onPush(
  context: Context<Webhooks.WebhookPayloadPush>
): Promise<void> {
  const commits = context.payload.commits;
  const messages = commits.map((commit: GithubCommit) => commit.message);
  const lintOutput: LintResults[] = messages.map(lintCommit);
  const commitScores: number[] = lintOutput.map((result: LintResults) =>
    result.reduce((prevScore, currResult) => prevScore + currResult.score, 0)
  );
  console.log(commitScores);
}
