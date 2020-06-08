import { createRule, RuleFactoryCheckResults } from "./factory";
import { Commit } from "@commitlint/parse";

export default createRule({
  name: "subject-no-end-period",
  score: 5,
  check: (commit: Commit): RuleFactoryCheckResults => {
    const valid = commit.header.charAt(commit.header.length - 1) !== ".";
    return valid ? null : {};
  },
});
