import { sendSlackSummary } from "./slack";
import { getCommitDiagnoses } from "./db/models/CommitDiagnosis";
import { getCommits } from "./db/models/Commit";
import { SLACK_DAY_INTERVAL } from "./config";

const dateOffset = 86400000 * SLACK_DAY_INTERVAL; // day interval in milliseconds: 24 * 60 * 60 * 1000 * DAY_INTERVAL

export async function slackJob(): Promise<void> {
  const afterTimestamp = new Date(Date.now() - dateOffset);
  const commitDiagnoses = await getCommitDiagnoses(afterTimestamp);
  const commits = await getCommits(afterTimestamp);
  await sendSlackSummary({
    numCommits: commits.length,
    numCommitDiagnoses: commitDiagnoses.length,
  });
}
