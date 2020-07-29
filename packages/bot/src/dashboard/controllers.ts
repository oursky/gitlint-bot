/* global BigInt */
import {
  getRepoViolationCounts,
  getViolatedCommitsPerRepo,
  getViolatedCommitCount,
  getCommitPage,
  findCommit,
  Commit,
} from "../db/models/Commit";

const recentCommitsCount = 10;
const pageSize = 10;

interface RepositoryViolationSummary {
  violationPercentage: string;
  name: string;
  commits: Commit[];
}

type RepositorySummary = RepositoryViolationSummary[];

export async function getRepositorySummary(): Promise<RepositorySummary> {
  const repoMap: Record<string, RepositoryViolationSummary> = {};
  const violationCounts = await getRepoViolationCounts();
  for (const { repo_name, total_count, violated_count } of violationCounts) {
    const percentage = (
      (Number(violated_count) / Number(total_count)) *
      100
    ).toFixed(2);
    repoMap[repo_name] = {
      name: repo_name,
      violationPercentage: percentage,
      commits: [],
    };
  }
  const violatedCommits = await getViolatedCommitsPerRepo(recentCommitsCount);
  for (const commit of violatedCommits) {
    repoMap[commit.repo_name].commits.push(commit);
  }
  return Object.values(repoMap);
}

export async function getViolatedCommits(
  pageNumber: number = 1
): Promise<Commit[]> {
  if (pageNumber < 1) {
    pageNumber = 1;
  }
  const commits = await getCommitPage((pageNumber - 1) * pageSize, pageSize);
  return commits;
}

interface CommitCounts {
  totalCount: bigint;
  pageCount: number;
}

export async function getCommitCounts(): Promise<CommitCounts> {
  const results = await getViolatedCommitCount();
  const count = BigInt(results[0].count);
  let pageCount: number;
  const pageLength = BigInt(pageSize);
  pageCount = Number(count / pageLength);
  pageCount = count % pageLength !== BigInt(0) ? pageCount + 1 : pageCount;
  return {
    pageCount,
    totalCount: count,
  };
}

export async function getCommit(commitId: string): Promise<Commit | undefined> {
  return findCommit(commitId);
}
