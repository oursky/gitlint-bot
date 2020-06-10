export interface CommitDiagnosisModel {
  id: number;
  commit_id: string;
  rule: string;
  data: Record<string, unknown>;
}
