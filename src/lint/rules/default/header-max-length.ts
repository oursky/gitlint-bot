import { RuleCheckResults } from "types/rules";
import { Commit } from "@commitlint/parse";

export default {
  name: "header-max-length",
  score: 5,
  check: (commit: Commit): RuleCheckResults => {
    const valid = commit.header.length < 50;
    return {
      valid,
      data: {},
    };
  },
};
