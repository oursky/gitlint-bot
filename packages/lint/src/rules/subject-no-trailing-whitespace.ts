import { Commit } from "../parser";
import { RuleCheckResults } from "./";

export default {
  name: "subject-no-trailing-whitespace",
  score: 5,
  check: (commit: Commit): RuleCheckResults => {
    const valid = !/\s+$/u.test(commit.subject ?? commit.header);
    return valid ? null : {};
  },
};
