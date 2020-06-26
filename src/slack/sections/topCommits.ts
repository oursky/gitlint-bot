import { createMarkdownSection, getCommitSubjectLine } from "../utils";
import { Block } from "@slack/types";
import { CommitWithDiagnoses } from "../../db";

export async function createTopCommitsSection(
  topCommits: CommitWithDiagnoses[]
): Promise<Block> {
  const commitCount = topCommits.length;
  const header = `*Top ${commitCount} commit messages with highest lint violation scores:*\n`;
  const messageBody = (
    await Promise.all(
      topCommits.map(async (commit) => {
        const subjectLine = await getCommitSubjectLine(commit);
        const shortId = commit.id.slice(0, 8);

        const messageComponents: string[] = [
          `• <${commit.url}|${commit.repo_name}@${shortId}> | total score: ${commit.score}\n\t\`${subjectLine}\``,
        ];
        commit.diagnoses.forEach((diagnosis) => {
          messageComponents.push(
            `\t• \`${diagnosis.rule}\` | score: ${diagnosis.score}`
          );
        });
        return messageComponents.join("\n");
      })
    )
  ).join("\n");
  return createMarkdownSection(header + messageBody);
}
