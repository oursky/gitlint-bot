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

export async function getCommitDiagnosesAfterDate(
  afterDate: Date
): Promise<Pick<CommitDiagnosis, "rule" | "data">[]> {
  return db(tableName)
    .select(["rule", "data"])
    .innerJoin("commit", function () {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      this.on("commit_diagnosis.commit_id", "=", "commit.id");
    })
    .where("commit.committed_at", ">", afterDate.toISOString());
}

export async function getCommitDiagnosesByCommitIds(
  commitIds: string[]
): Promise<CommitDiagnosis[]> {
  return db
    .from<CommitDiagnosis>(tableName)
    .select("*")
    .whereIn("commit_id", commitIds);
}
