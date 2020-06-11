import db from "../db";

const tableName = "commit";

export interface Commit {
  id: string;
  user_id: number;
  score: number;
  message: string;
  committed_at: string;
}

export async function findCommit(id: string): Promise<Commit | undefined> {
  return db(tableName).where("id", id).first();
}

export async function createCommit(commit: Commit): Promise<Commit> {
  return db(tableName).returning("*").insert(commit);
}
