/* global BigInt */
import {
  getRepoViolationCounts,
  getViolatedCommitsPerRepo,
  getViolatedCommitCount,
  getCommitPage,
  Commit,
} from "../db/models/Commit";

const recentCommitsCount = 10;
const pageSize = 20;

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
  pageNumber: number = 0
): Promise<Commit[]> {
  const commits = await getCommitPage(pageNumber * pageSize, pageSize);
  return commits;
}

export async function getPageCount(): Promise<number> {
  const results = await getViolatedCommitCount();
  const count = BigInt(results[0].count);
  let pageCount: number;
  const pageLength = BigInt(pageSize);
  pageCount = Number(count / pageLength);
  pageCount =
    count % pageLength !== BigInt(0) && count > pageLength
      ? pageCount + 1
      : pageCount;
  return pageCount;
}
