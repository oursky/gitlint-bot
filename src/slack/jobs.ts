import { sendSlackSummary } from "./index";
import { SLACK_DAY_INTERVAL } from "../config";
import { getTopCommitsWithDiagnoses } from "../db";

const msInDay = 86400000; // 24 * 60 * 60 * 1000 milliseconds in 1 day

export async function summaryJob(
  durationDays: number = SLACK_DAY_INTERVAL
): Promise<void> {
  const summaryDuration = msInDay * durationDays;
  const afterDate = new Date(Date.now() - summaryDuration);
  const topCommits = await getTopCommitsWithDiagnoses(afterDate);
  await sendSlackSummary({
    topCommits,
  });
}
