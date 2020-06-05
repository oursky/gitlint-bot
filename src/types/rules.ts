export interface DiagnosisResults {
  valid: boolean;
  data: Record<string, unknown>;
}
export interface RuleConfig {
  score: number;
  diagnose: DiagnoseFunc;
}
export interface DiagnoseFunc {
  (commitMessage: string): DiagnosisResults;
}
export type RuleName = "header-max-length";
export type RulesConfig = Record<RuleName, RuleConfig>;
