import { lintCommitMessage } from "./";
import fc from "fast-check";
import { instantiateConfig } from "./config";

describe("'lintCommitMessage' function", () => {
  describe("when an empty rule config is provided", () => {
    it("should return 0 score and empty violations list", async () => {
      await fc.assert(
        fc.asyncProperty(fc.fullUnicodeString(), async (commitMessage) => {
          const lintOutput = await lintCommitMessage(
            commitMessage,
            instantiateConfig()
          );
          expect(lintOutput).toMatchObject({
            score: 0,
            violations: [],
          });
        })
      );
    });
  });
});
