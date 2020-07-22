import {
  getRepoViolationCounts,
  getViolatedCommitsPerRepo,
  Commit,
} from "../db/models/Commit";

const recentCommitsCount = 10;

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
