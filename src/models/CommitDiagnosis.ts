import db from "../db";

const tableName = "commit_diagnosis";

export interface CommitDiagnosisModel {
  id: number;
  commit_id: string;
  rule: string;
  data: Record<string, unknown>;
}

export async function createCommitDiagnosis(
  commitDiagnosis: Omit<CommitDiagnosisModel, "id">
): Promise<void> {
  return db(tableName).insert(commitDiagnosis);
}
