import db from "..";

const tableName = "commit_diagnosis";

export interface CommitDiagnosis {
  id: number;
  commit_id: string;
  rule: string;
  data: Record<string, unknown>;
}

export async function createCommitDiagnosis(
  commitDiagnosis: Omit<CommitDiagnosis, "id">
): Promise<void> {
  return db(tableName).insert(commitDiagnosis);
}
