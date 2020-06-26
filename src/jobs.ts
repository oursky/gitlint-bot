import { sendSlackSummary } from "./slack/index";
import { SLACK_DAY_INTERVAL } from "./config";
import { getTopCommitsWithDiagnoses } from "./db";

const msInDay = 86400000; // 24 * 60 * 60 * 1000 milliseconds in 1 day
const summaryDuration = msInDay * SLACK_DAY_INTERVAL;

export async function slackJob(): Promise<void> {
  const afterDate = new Date(Date.now() - summaryDuration);
  const topCommits = await getTopCommitsWithDiagnoses(afterDate);
  await sendSlackSummary({
    topCommits,
  });
}
