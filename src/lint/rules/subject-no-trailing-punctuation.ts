import { RuleCheckResults } from ".";
import { Commit } from "../parser";

export default {
  name: "subject-no-trailing-punctuation",
  score: 5,
  check: (commit: Commit): RuleCheckResults => {
    const valid = !/[?:!.,;]$/u.test(commit.header);
    return valid ? null : {};
  },
};
