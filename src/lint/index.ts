import { RuleViolation, RulesPreset } from "./rules";
import { defaultPreset } from "./presets";
import { parseCommit } from "./parser";

export interface ViolationInfo {
  ruleName: string;
  violation: RuleViolation;
}
export interface LintResult {
  violations: ViolationInfo[];
  score: number;
}

export async function lintCommitMessage(
  commitMessage: string,
  preset: RulesPreset = defaultPreset
): Promise<LintResult> {
  const commit = await parseCommit(commitMessage);
  let score = 0;
  const violations = [];

  for (const rule of preset) {
    const violation = rule.check(commit);
    if (violation !== null) {
      score += rule.score;
      violations.push({
        ruleName: rule.name,
        violation,
      });
    }
  }

  return {
    score,
    violations,
  };
}
