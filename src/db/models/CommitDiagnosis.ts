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

export async function getCommitDiagnoses(
  afterTimestamp: Date
): Promise<Pick<CommitDiagnosis, "rule" | "data">[]> {
  return db(tableName)
    .select(["rule", "data"])
    .innerJoin("commit", function () {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      this.on("commit_diagnosis.commit_id", "=", "commit.id");
    })
    .where("commit.committed_at", ">", afterTimestamp.toISOString());
}
