/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { lintCommitMessage } from "./";
import fc from "fast-check";

describe("'lintCommitMessage' function", () => {
  describe("when a unicode string commit message is provided", function () {
    it("should produce an object matching the LintResult type", async () => {
      await fc.assert(
        fc.asyncProperty(fc.unicodeString(), async (input) => {
          const lintOutput = await lintCommitMessage(input);
          expect(lintOutput).toBeDefined();
          expect(lintOutput).toEqual({
            score: expect.any(Number),
            violations: expect.arrayContaining([
              {
                ruleName: expect.any(String),
                violation: expect.any(Object),
              },
            ]),
          });
        })
      );
    });

    it("should return a score greater than or equal to 0", async () => {
      await fc.assert(
        fc.asyncProperty(fc.unicodeString(), async (input) => {
          const lintOutput = await lintCommitMessage(input);
          expect(lintOutput.score).toBeGreaterThanOrEqual(0);
        })
      );
    });
  });
});
