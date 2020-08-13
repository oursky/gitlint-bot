import { RuleCheckResults } from "./";
import { Commit } from "../parser";

export default {
  name: "subject-no-hard-tab",
  score: 5,
  check: (commit: Commit): RuleCheckResults => {
    const valid = !/\t/u.test(commit.subject ?? commit.header);
    return valid ? null : {};
  },
};
