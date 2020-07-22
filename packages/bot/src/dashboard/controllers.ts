import {
  getRepoViolationPercentages,
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
  const violationPercentages = await getRepoViolationPercentages();
  for (const { repoName, percentage } of violationPercentages) {
    repoMap[repoName] = {
      name: repoName,
      violationPercentage: percentage + "%",
      commits: [],
    };
  }
  const violatedCommits = await getViolatedCommitsPerRepo(recentCommitsCount);
  for (const commit of violatedCommits) {
    repoMap[commit.repo_name].commits.push(commit);
  }
  return Object.values(repoMap);
}
