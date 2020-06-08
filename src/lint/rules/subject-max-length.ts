import { createRule, RuleFactoryCheckResults } from "./factory";
import { Commit } from "@commitlint/parse";

const maxLength = 50;

export default createRule({
  name: "subject-max-length",
  score: 5,
  check: (commit: Commit): RuleFactoryCheckResults => {
    const actualLength = commit.header.length;
    return actualLength <= maxLength
      ? null
      : {
          actualLength,
          maxLength,
        };
  },
});
