import { defaultRules } from "./rules";
import { RuleCheckResults } from "types/rules";
import parse from "@commitlint/parse";

export type LintResults = LintResult[];
export interface LintResult {
  checkResults: RuleCheckResults;
  name: string;
  score: number;
}

export async function lintCommitMessage(
  commitMessage: string
): Promise<LintResults> {
  const commit = await parse(commitMessage);

  return defaultRules.map(
    (rule): LintResult => {
      const checkResults = rule.check(commit);
      return {
        checkResults,
        score: checkResults.valid ? rule.score : 0,
        name: rule.name,
      };
    }
  );
}
