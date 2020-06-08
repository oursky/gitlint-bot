import { createRule, RuleFactoryCheckResults } from "./factory";
import { Commit } from "@commitlint/parse";

export default createRule({
  name: "subject-capitalize-first",
  score: 5,
  check: (commit: Commit): RuleFactoryCheckResults => {
    const valid = /^\p{Lu}/u.test(commit.header);
    return valid ? null : {};
  },
});
