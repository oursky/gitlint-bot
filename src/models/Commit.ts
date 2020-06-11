import db from "../db";

const tableName = "commit";

export interface CommitModel {
  id: string;
  user_id: number;
  score: number;
  message: string;
  committed_at: string;
}

export async function findCommit(id: string): Promise<CommitModel | undefined> {
  return db(tableName).where("id", id).first();
}

export async function createCommit(
  commit: CommitModel
): Promise<CommitModel | undefined> {
  return db(tableName).returning("*").insert(commit);
}
