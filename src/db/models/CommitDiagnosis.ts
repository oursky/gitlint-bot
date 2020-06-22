import db from "../db";
import * as Knex from "knex";

const tableName = "commit_diagnosis";

export interface CommitDiagnosis {
  id: number;
  commit_id: string;
  rule: string;
  data: Record<string, unknown>;
}

export async function createCommitDiagnosis(
  commitDiagnosis: Omit<CommitDiagnosis, "id">,
  client: Knex = db
): Promise<void> {
  return client(tableName).insert(commitDiagnosis);
}
