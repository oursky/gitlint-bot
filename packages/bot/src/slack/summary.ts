import { Block } from "@slack/types";
import { getTopCommitsWithDiagnoses } from "../db";
import { createMarkdownSection, dividerBlock } from "./utils";
import { createTopCommitsSection } from "./sections/topCommits";

const msInDay = 86400000; // 24 * 60 * 60 * 1000 milliseconds in 1 day

export async function createSlackSummaryMessage(
  durationDays: number
): Promise<Block[]> {
  const summaryDuration = msInDay * durationDays;
  const afterDate = new Date(Date.now() - summaryDuration);
  const topCommits = await getTopCommitsWithDiagnoses(afterDate);
  const summaryHeaderSection = createMarkdownSection(
    `Commit message lint summary for past ${durationDays} days`
  );
  const filteredTopCommits = topCommits.filter((commit) => commit.score > 0);
  const topCommitsSection = await createTopCommitsSection(filteredTopCommits);
  return [summaryHeaderSection, dividerBlock, topCommitsSection];
}
