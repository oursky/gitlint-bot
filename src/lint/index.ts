import rules, { RuleViolation } from "./rules";
import { parseCommit } from "./parser";
import { RulesPreset } from "./config/schema";
import { defaultPreset } from "./presets";

export interface ViolationInfo {
  ruleName: string;
  violation: RuleViolation;
  score: number;
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

  for (const [ruleName, ruleConfig] of Object.entries(preset)) {
    const rule = rules[ruleName];
    if (typeof rule === "undefined" || ruleConfig[0] === "off") {
      continue;
    }
    const ruleScore = ruleConfig[1] ?? rule.score;
    const violation = rule.check(commit, ...ruleConfig.slice(2));

    if (violation !== null) {
      score += ruleScore;
      violations.push({
        ruleName: rule.name,
        violation,
        score: ruleScore,
      });
    }
  }

  return {
    score,
    violations,
  };
}
