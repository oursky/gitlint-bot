import { RuleCheckResults } from "./";
import { Commit } from "../parser";

export default {
  name: "body-max-line-length",
  score: 5,
  check: (commit: Commit, maxLength: number = 80): RuleCheckResults => {
    const body = commit.body;
    if (body === null) {
      return null;
    }
    const violatedLines = body
      .split("\n")
      .map((line, idx) => ({
        length: [...line].length,
        idx: idx + 1,
      }))
      .filter((line) => line.length > maxLength);

    if (violatedLines.length === 0) {
      return null;
    }
    return {
      maxLength,
      violatedLines: violatedLines.map((line) => line.idx),
    };
  },
};
