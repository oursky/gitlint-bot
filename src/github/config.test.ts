import { Octokit } from "probot";
import { getConfig } from "./config";

const client = new Octokit();
const masterRef = "refs/heads/master";

describe("'getConfig' function", () => {
  describe("when repository full name is invalid", () => {
    it("should return null", async () => {
      const emptyString = await getConfig(client, "", masterRef);
      const noSlash = await getConfig(client, "test", masterRef);
      expect(emptyString).toBeNull();
      expect(noSlash).toBeNull();
    });
  });
});
