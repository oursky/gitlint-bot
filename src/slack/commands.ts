import express from "express";
import validateSlackRequest from "validate-slack-request";
import Sentry from "../sentry";
import { SLACK_SIGNING_SECRET } from "../config";

const router = express.Router();

const slackValidationMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
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

export default router;
