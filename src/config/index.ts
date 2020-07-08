import { Octokit } from "probot";
import { loadConfig } from "./loader";
import ConfigSchema, { Config } from "./schema";

const configFileName = ".gitlintrc";
const extensions = ["", ".yaml", ".yml"];

export async function getConfig(
  apiClient: Octokit,
  repoFullName: string,
  ref: string
): Promise<Config | null> {
  const owner = repoFullName.split("/")[0];
  const repo = repoFullName.split("/")[1];
  let config = null;

  for (const extension of extensions) {
    const path = configFileName + extension;
    config = await loadConfig(apiClient, {
      path,
      owner,
      repo,
      ref,
    });
    if (config !== null) break;
  }
  if (config === null) return null;
  const { error } = ConfigSchema.validate(config);
  if (typeof error !== "undefined") return null;
  return config as Config;
}
