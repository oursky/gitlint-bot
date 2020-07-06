import { Request } from "express";
import getRawBody from "raw-body";
import { SectionBlock, DividerBlock } from "@slack/types";
import { verifyRequestSignature } from "@slack/events-api";
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

export async function validateSlackRequest(
  signingSecret: string,
  req: Request
): Promise<boolean> {
  const requestSignature = req.header("x-slack-signature");
  const requestTimestamp = Number(req.header("x-slack-request-timestamp"));
  if (
    typeof requestSignature === "undefined" ||
    Number.isNaN(requestTimestamp)
  ) {
    return false;
  }
  const rawBody = await getRawBody(req, {
    encoding: "utf-8",
  });

  try {
    verifyRequestSignature({
      signingSecret,
      requestSignature,
      requestTimestamp,
      body: rawBody,
    });
    return true;
  } catch {
    return false;
  }
}
