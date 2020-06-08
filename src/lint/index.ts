import { RuleViolation } from "./rules";
import { defaultPreset } from "./presets";
import parse from "@commitlint/parse";

export interface LintResult {
  violations: RuleViolation[];
  score: number;
}

export async function lintCommitMessage(
  commitMessage: string
): Promise<LintResult> {
  const commit = await parse(commitMessage);
  let score = 0;

  const violations = defaultPreset
    .map((rule) => {
      const checkResult = rule.check(commit);
      if (checkResult === null) {
        score += rule.score;
      }
      return checkResult;
    })
    .filter(
      (checkResult): checkResult is RuleViolation => checkResult !== null
    );

  return {
    score,
    violations,
  };
}
