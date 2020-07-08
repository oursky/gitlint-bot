import { Octokit } from "probot";
import { loadConfig } from "./loader";

const configFileName = ".gitlintrc";
const extensions = ["", ".yaml", ".yml"];

export async function getConfig(
  apiClient: Octokit,
  repoFullName: string,
  ref: string
): Promise<void> {
  const owner = repoFullName.split("/")[0];
  const repo = repoFullName.split("/")[1];
  let fileContents = null;

  for (const extension of extensions) {
    const path = configFileName + extension;
    fileContents = await loadConfig(apiClient, {
      path,
      owner,
      repo,
      ref,
    });
    if (fileContents === null) {
      continue;
    }
  }
  console.log(fileContents);
}
