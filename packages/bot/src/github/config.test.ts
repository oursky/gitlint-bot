import { Octokit } from "probot";
import { createGithubFileLoader } from "./config";

const client = new Octokit();
const masterRef = "refs/heads/master";

describe("'createGithubFileLoader' function", () => {
  describe("when repository full name is invalid", () => {
    it("should return a file loader that returns null", async () => {
      const emptyStringFileLoader = createGithubFileLoader(
        client,
        "",
        masterRef
      );
      const noSlashFileLoader = createGithubFileLoader(
        client,
        "test",
        masterRef
      );
      const emptyStringResult = await emptyStringFileLoader(".gitlintrc");
      const noSlashResult = await noSlashFileLoader(".gitlintrc");
      expect(emptyStringResult).toBeNull();
      expect(noSlashResult).toBeNull();
    });
  });
});
