import { RuleCheckResults } from "types/rules";
import { Commit } from "@commitlint/parse";

export default {
  name: "subject-capitalize-first",
  score: 5,
  check: (commit: Commit): RuleCheckResults => {
    const firstChar = commit.header.charAt(0);
    const valid = firstChar === firstChar.toUpperCase();
    return valid ? null : {};
  },
};
