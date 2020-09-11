import express, { Request, Response, NextFunction } from "express";
import {
  validateSlackRequest,
  asyncMiddleware,
  RequestWithRawBody,
} from "./utils";
import Sentry from "../sentry";
import { summaryJob } from "./jobs";
import { SLACK_SIGNING_SECRET, SLACK_DAY_INTERVAL } from "../env";
import { createSlackSummaryMessage } from "./summary";

const router = express.Router();

const slackValidationMiddleware = async (
  req: RequestWithRawBody,
  res: Response,
  next: NextFunction
) => {
  try {
    const valid = await validateSlackRequest(SLACK_SIGNING_SECRET, req);
    if (valid) {
      next();
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    Sentry.captureException(err);
    res.sendStatus(500);
  }
};

// needed to parse 'application/x-www-form-urlencoded' slack payload
router.use(
  express.urlencoded({
    extended: true,
    verify: (req: RequestWithRawBody, _, buf) => {
      req.rawBody = buf;
    },
  })
);
router.use(asyncMiddleware(slackValidationMiddleware));

// https://api.slack.com/interactivity/slash-commands#app_command_handling
interface SlackReqBody {
  token: string;
  command: string;
  text: string;
  response_url: string;
  trigger_id: string;
  user_id: string;
  user_name: string;
}

/**
 * Endpoint for summary slash command
 *
 * Usage: `/COMMAND-NAME [duration (default: {SLACK_DAY_INTERVAL} days)]`
 */
router.post("/summary", async (req: Request, res: Response) => {
  const { text } = req.body as SlackReqBody;
  let duration = Number(text);
  if (Number.isNaN(duration) || text.trim().length === 0) {
    duration = SLACK_DAY_INTERVAL;
  }
  const message = await createSlackSummaryMessage(duration);
  res.json({
    response_type: "ephemeral",
    blocks: message,
  });
  await summaryJob(duration);
});

export default router;
