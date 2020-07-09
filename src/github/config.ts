import { Octokit } from "probot";
import { FileLoader } from "../lint/config";

export function createGithubFileLoader(
  apiClient: Octokit,
  repoFullName: string,
  ref: string
): FileLoader {
  const splitName = repoFullName.split("/");
  if (splitName.length === 1) return async (_: string): Promise<null> => null;
  const owner = splitName[0];
  const repo = splitName[1];

  return async (path: string): Promise<string | null> => {
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
      return buf.toString("utf8");
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err.status !== 404) throw err;
    }
    return null;
  };
}
