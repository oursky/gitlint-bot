import { Octokit } from "probot";
import { safeLoad } from "js-yaml";
import { Config } from "../lint/config/schema";
import { configFileName, configFileExtensions } from "../lint/config";

interface RepoInfo {
  owner: string;
  repo: string;
  ref: string;
  path: string;
}

export async function getConfig(
  apiClient: Octokit,
  repoFullName: string,
  ref: string
): Promise<Config | null> {
  const splitName = repoFullName.split("/");
  if (splitName.length === 1) return null;
  const owner = splitName[0];
  const repo = splitName[1];
  let config = null;

  for (const extension of configFileExtensions) {
    const path = configFileName + extension;
    config = (await loadConfig(apiClient, {
      path,
      owner,
      repo,
      ref,
    })) as Config | null;
    if (config !== null) break;
  }
  return config;
}

async function loadConfig(
  apiClient: Octokit,
  { owner, repo, ref, path }: RepoInfo
): // eslint-disable-next-line @typescript-eslint/ban-types
Promise<null | object> {
  try {
    const response = await apiClient.repos.getContents({
      path,
      owner,
      repo,
      ref,
    });
    const data = response.data;
    if (
      data instanceof Array ||
      data.type !== "file" ||
      typeof data.content === "undefined"
    ) {
      return null;
    }
    const buf = Buffer.from(data.content, "base64");
    const fileString = buf.toString("utf8");
    const parsed = safeLoad(fileString);
    if (typeof parsed === "object") {
      return parsed;
    }
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (err.status !== 404) throw err;
  }
  return null;
}
