import { RuleCheckResults } from "./";
import { Commit } from "../parser";

export default {
  name: "subject-min-length",
  score: 5,
  check: (commit: Commit, minLength: number = 10): RuleCheckResults => {
    const actualLength = [...commit.header].length;
    return actualLength >= minLength
      ? null
      : {
          actualLength,
          minLength,
        };
  },
};
