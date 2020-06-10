import { RuleViolation, RulesPreset } from "./rules";
import { defaultPreset } from "./presets";
import parse, { Commit } from "@commitlint/parse";

const blankCommit = {
  raw: "",
  header: "",
  type: null,
  scope: null,
  subject: null,
  body: null,
  footer: null,
  mentions: [],
  notes: [],
  references: [],
  revert: null,
  merge: null,
};

function createCommit(commit: Partial<Commit> = {}): Commit {
  return {
    ...blankCommit,
    ...commit,
  };
}

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
  // parser throws error if commit message is empty
  const commit =
    commitMessage.trim().length !== 0
      ? await parse(commitMessage)
      : createCommit();
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
