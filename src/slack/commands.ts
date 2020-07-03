import express, { Request, Response, NextFunction } from "express";
import validateSlackRequest from "validate-slack-request";
import Sentry from "../sentry";
import { summaryJob } from "./jobs";
import { SLACK_SIGNING_SECRET, SLACK_DAY_INTERVAL } from "../config";

const router = express.Router();

const slackValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const valid = validateSlackRequest(SLACK_SIGNING_SECRET, req);
    if (valid) {
      next();
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    Sentry.captureException(err);
    next(err);
  }
};

// needed to parse 'application/x-www-form-urlencoded' slack payload
router.use(express.urlencoded({ extended: true }));
router.use(slackValidationMiddleware);

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
 * Usage: `/gitlint-summary [duration (default: {SLACK_DAY_INTERVAL} days)]`
 */
router.post("/summary", async (req: Request) => {
  const { text } = req.body as SlackReqBody;
  let duration = Number(text);
  if (Number.isNaN(duration)) {
    duration = SLACK_DAY_INTERVAL;
  }
  await summaryJob(duration);
});

export default router;
