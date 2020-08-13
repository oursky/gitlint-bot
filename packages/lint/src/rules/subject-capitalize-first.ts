import { Commit } from "../parser";
import { RuleCheckResults } from "./";

export default {
  name: "subject-capitalize-first",
  score: 5,
  check: (commit: Commit): RuleCheckResults => {
    const valid = /^\p{Lu}/u.test(commit.subject ?? commit.header);
    return valid ? null : {};
  },
};
