import { Octokit } from "probot";
import Sentry from "../sentry";
import { safeLoad } from "js-yaml";

interface RepoInfo {
  owner: string;
  repo: string;
  ref: string;
  path: string;
}

export async function loadConfig(
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
    if (err.status !== 404) Sentry.captureException(err);
  }
  return null;
}
