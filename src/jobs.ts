import { sendSlackSummary } from "./slack";
import { getCommitDiagnosesAfterDate } from "./db/models/CommitDiagnosis";
import { getCommitsAfterDate } from "./db/models/Commit";
import { SLACK_DAY_INTERVAL } from "./config";

const msInDay = 86400000; // 24 * 60 * 60 * 1000 milliseconds in 1 day
const summaryDuration = msInDay * SLACK_DAY_INTERVAL;

export async function slackJob(): Promise<void> {
  const afterDate = new Date(Date.now() - summaryDuration);
  const commitDiagnoses = await getCommitDiagnosesAfterDate(afterDate);
  const commits = await getCommitsAfterDate(afterDate);
  await sendSlackSummary({
    numCommits: commits.length,
    numCommitDiagnoses: commitDiagnoses.length,
  });
}
