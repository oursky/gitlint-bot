import { Request } from "express";

export default function validateSlackRequest(
  signingSecret: string,
  req: Request,
  logging?: boolean
): boolean;
