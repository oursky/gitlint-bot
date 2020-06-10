import { RuleViolation, RulesPreset } from "./rules";
import { defaultPreset } from "./presets";
import parse from "@commitlint/parse";

interface ViolationInfo {
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
  const commit = await parse(commitMessage);
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
