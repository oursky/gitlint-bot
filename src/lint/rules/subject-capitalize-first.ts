import { RuleCheckResults } from "./";
import { Commit } from "@commitlint/parse";

export default {
  name: "subject-capitalize-first",
  score: 5,
  check: (commit: Commit): RuleCheckResults => {
    const codePoint = commit.header.codePointAt(0);
    if (typeof codePoint === "undefined") {
      return {};
    }
    const valid = codePoint >= 65 && codePoint <= 90;
    return valid ? null : {};
  },
};
