import { createRule, RuleFactoryCheckResults } from "./factory";
import { Commit } from "@commitlint/parse";

const minLength = 0;

export default createRule({
  name: "subject-min-length",
  score: 5,
  check: (commit: Commit): RuleFactoryCheckResults => {
    const actualLength = commit.header.length;
    return actualLength >= minLength
      ? null
      : {
          actualLength,
          minLength,
        };
  },
});
