import { defaultRules } from "./rules";
import { DiagnosisResults } from "types/rules";

export type LintResults = LintResult[];
export interface LintResult {
  diagnosis: DiagnosisResults;
  name: string;
  score: number;
}

export function lintCommit(commitMessage: string): LintResults {
  const lintResults = defaultRules.map((rule) => {
    const diagnosis = rule.diagnose(commitMessage);
    return {
      diagnosis,
      score: diagnosis.valid ? rule.score : 0,
      name: rule.name,
    };
  });
  return lintResults;
}
