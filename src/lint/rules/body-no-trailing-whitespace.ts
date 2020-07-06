import { Commit } from "../parser";
import { RuleCheckResults } from "./";

export default {
  name: "body-no-trailing-whitespace",
  score: 5,
  check: (commit: Commit): RuleCheckResults => {
    const body = commit.body;
    if (body === null) return null;
    const valid = !/\s+$/u.test(body);
    return valid ? null : {};
  },
};
