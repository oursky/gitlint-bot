import { SectionBlock, DividerBlock } from "@slack/types";
import { parseCommit } from "../lint/parser";
import { Commit } from "../db/models/Commit";

export const dividerBlock: DividerBlock = {
  type: "divider",
};

export function createMarkdownSection(text: string): SectionBlock {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text,
    },
  };
}

export async function getCommitSubjectLine(commit: Commit): Promise<string> {
  const parsedCommit = await parseCommit(commit.message);
  return parsedCommit.header;
}
