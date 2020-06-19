import { setupLogging } from "./logger";
setupLogging();

import { Application } from "probot";
import { onPush } from "./listeners";
import { slackJob } from "./jobs";
import { SLACK_CRON_PATTERN } from "./config";
import cron from "node-cron";
import "./setupLogging";

export = (app: Application) => {
  app.on("push", onPush);
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  cron.schedule(SLACK_CRON_PATTERN, slackJob, {
    // node-cron v2+ allows tasks to return Promises: https://github.com/node-cron/node-cron/releases/tag/v2.0.0
    scheduled: true,
    timezone: "Asia/Hong_Kong",
  });
};
