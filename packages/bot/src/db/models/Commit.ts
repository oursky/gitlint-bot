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

interface RepoViolationPercentage {
  repoName: string;
  percentage: number;
}

export async function getRepoViolationPercentages(): Promise<
  RepoViolationPercentage[]
> {
  return db
    .from<Commit>("commit as t1")
    .select("repo_name as repoName")
    .select(
      db.raw(`ROUND((0.0 + (
      SELECT COUNT(ID) 
      FROM commit
      WHERE score > 0 AND repo_name = t1.repo_name
    )) / COUNT(ID), 2) * 100 as percentage`)
    )
    .groupBy("repo_name");
}
