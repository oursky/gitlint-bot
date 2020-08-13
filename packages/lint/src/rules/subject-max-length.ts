import { RuleCheckResults } from "./";
import { Commit } from "../parser";

export default {
  name: "subject-max-length",
  score: 5,
  check: (commit: Commit, maxLength: number = 80): RuleCheckResults => {
    const actualLength = [...(commit.subject ?? commit.header)].length;
    return actualLength <= maxLength
      ? null
      : {
          actualLength,
          maxLength,
        };
  },
};
