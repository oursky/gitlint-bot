import { Request, NextFunction, Response, RequestHandler } from "express";
import { SectionBlock, DividerBlock } from "@slack/types";
import { verifyRequestSignature } from "@slack/events-api";
import { parseCommit } from "../lint/parser";
import { Commit } from "../db/models/Commit";

export interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}

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

// eslint-disable-next-line @typescript-eslint/ban-types
export const asyncMiddleware = (fn: Function): RequestHandler => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export async function validateSlackRequest(
  signingSecret: string,
  req: RequestWithRawBody
): Promise<boolean> {
  const requestSignature = req.header("x-slack-signature");
  const requestTimestamp = Number(req.header("x-slack-request-timestamp"));
  if (
    typeof requestSignature === "undefined" ||
    Number.isNaN(requestTimestamp)
  ) {
    return false;
  }

  try {
    verifyRequestSignature({
      signingSecret,
      requestSignature,
      requestTimestamp,
      body: req.rawBody.toString(),
    });
    return true;
  } catch {
    return false;
  }
}
