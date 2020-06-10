/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { lintCommitMessage } from "./";
import fc from "fast-check";

describe("'lintCommitMessage' function", () => {
  describe("when an empty rule preset is provided", () => {
    it("should return 0 score and empty violations list", async () => {
      await fc.assert(
        fc.asyncProperty(fc.fullUnicodeString(), async (commitMessage) => {
          const lintOutput = await lintCommitMessage(commitMessage, []);
          expect(lintOutput).toMatchObject({
            score: 0,
            violations: [],
          });
        })
      );
    });
  });

  describe("when a non-empty rule preset is provided", () => {
    it("should call every rule 'check' function once", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(fc.fullUnicodeString()),
          fc.fullUnicodeString(),
          async (ruleNames, commitMessage) => {
            const checkMock = jest.fn();
            const preset = ruleNames.map((name) => ({
              name,
              score: 0,
              check: checkMock,
            }));
            await lintCommitMessage(commitMessage, preset);

            expect(checkMock.mock.calls.length).toEqual(preset.length);
          }
        )
      );
    });

    it("should only sum scores of rules when 'check' func returns violation", async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.constantFrom(
              fc.object({
                key: fc.fullUnicodeString(),
              }),
              null
            )
          ),
          fc.fullUnicodeString(),
          async (returnValues, commitMessage) => {
            const checkMock = jest.fn();
            returnValues.forEach((mockReturnValue) => {
              checkMock.mockReturnValueOnce(mockReturnValue);
            });
            const preset = returnValues.map(() => ({
              check: checkMock,
              score: 1,
              name: "sample-rule-name",
            }));
            const { score } = await lintCommitMessage(commitMessage, preset);
            const expectedScore = returnValues.reduce<number>(
              (prev, curr) => (curr !== null ? prev + 1 : prev),
              0
            );

            expect(score).toEqual(expectedScore);
          }
        )
      );
    });
  });
});
