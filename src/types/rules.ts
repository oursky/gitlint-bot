export interface DiagnosisResults {
  valid: boolean;
  data: Record<string, unknown>;
}
export interface RuleConfig {
  name: string;
  score: number;
  diagnose: DiagnoseFunc;
}
export interface DiagnoseFunc {
  (commitMessage: string): DiagnosisResults;
}
export type RulesList = [RuleConfig];
