import { RuleCheckResults } from "./";
import { Commit } from "../parser";

const maxLength = 80;

export default {
  name: "body-max-line-length",
  score: 5,
  check: (commit: Commit): RuleCheckResults => {
    const body = commit.body;
    if (body === null) {
      return null;
    }
    const violatedLines = body
      .split("\n")
      .map((line, idx) => ({
        length: [...line].length,
        idx,
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
