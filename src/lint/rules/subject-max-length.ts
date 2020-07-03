import { RuleCheckResults } from "./";
import { Commit } from "../parser";

const maxLength = 80;

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
