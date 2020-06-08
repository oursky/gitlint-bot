import { RuleCheckResults } from "./";
import { Commit } from "@commitlint/parse";

const maxLength = 50;

export default {
  name: "subject-max-length",
  score: 5,
  check: (commit: Commit): RuleCheckResults => {
    const actualLength = [...commit.header].length;
    return actualLength <= maxLength
      ? null
      : {
          actualLength,
          maxLength,
        };
  },
};
