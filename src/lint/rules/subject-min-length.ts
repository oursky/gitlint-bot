import { RuleCheckResults } from "./";
import { Commit } from "../parser";

const minLength = 10;

export default {
  name: "subject-min-length",
  score: 5,
  check: (commit: Commit): RuleCheckResults => {
    const actualLength = [...commit.header].length;
    return actualLength >= minLength
      ? null
      : {
          actualLength,
          minLength,
        };
  },
};
