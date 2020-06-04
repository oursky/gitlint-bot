import { Context } from "probot";
import Webhooks from "@octokit/webhooks";
import { lintCommit } from "./lint";

interface GithubCommit {
  message: string;
}

export async function onPush(
  context: Context<Webhooks.WebhookPayloadPush>
): Promise<void> {
  const commits = context.payload.commits;
  const messages = commits.map((commit: GithubCommit) => commit.message);
  const lintOutput = messages.map(lintCommit); // eslint-disable-line @typescript-eslint/no-unused-vars
}
