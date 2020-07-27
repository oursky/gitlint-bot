import db from "../db";
import * as Knex from "knex";

const tableName = "commit";

export interface Commit {
  id: string;
  user_id: number;
  score: number;
  message: string;
  committed_at: string;
  repo_name: string;
  url: string;
}

export async function findCommit(
  id: string,
  client: Knex = db
): Promise<Commit | undefined> {
  return client(tableName).where("id", id).first();
}

export async function createCommit(
  commit: Commit,
  client: Knex = db
): Promise<Commit> {
  const commits = await client(tableName)
    .returning("*")
    .insert<Commit[]>([commit]);
  return commits[0];
}

export async function getCommitsAfterDate(afterDate: Date): Promise<Commit[]> {
  return db(tableName)
    .select("*")
    .where<Commit[]>("commit.committed_at", ">", afterDate.toISOString());
}

export async function getTopCommitsAfterDate(
  afterDate: Date,
  limitCount: number
): Promise<Commit[]> {
  return db
    .from<Commit>(tableName)
    .select("*")
    .where("commit.committed_at", ">", afterDate.toISOString())
    .orderBy("commit.score", "desc")
    .orderBy("commit.committed_at", "desc")
    .limit(limitCount);
}

interface RepoViolationCounts {
  repo_name: string;
  total_count: string;
  violated_count: string;
}

export async function getRepoViolationCounts(): Promise<RepoViolationCounts[]> {
  return db
    .from<Commit>("commit as t1")
    .select("repo_name")
    .count("id as total_count")
    .select(
      db.raw(`(
        SELECT COUNT(ID) 
        FROM commit
        WHERE score > 0 AND repo_name = t1.repo_name
      ) as violated_count`)
    )
    .groupBy("repo_name");
}

export async function getViolatedCommitsPerRepo(
  count: number
): Promise<Commit[]> {
  return db
    .select([
      "id",
      "user_id",
      "score",
      "message",
      "committed_at",
      "repo_name",
      "url",
    ])
    .from(
      db.raw(`(SELECT 
        *, 
        ROW_NUMBER() OVER (PARTITION BY repo_name ORDER BY committed_at DESC) as rk
        FROM commit
        WHERE score > 0
      ) t`)
    )
    .where("rk", "<=", count);
}

export async function getCommitPage(
  offset: number,
  pageSize: number
): Promise<Commit[]> {
  return db
    .from<Commit>(tableName)
    .select("*")
    .where("score", ">", "0")
    .orderBy("committed_at", "desc")
    .orderBy("id")
    .offset(offset)
    .limit(pageSize);
}

export async function getViolatedCommitCount(): Promise<{ count: string }[]> {
  return db.from<Commit>(tableName).where("score", ">", "0").count("id");
}
