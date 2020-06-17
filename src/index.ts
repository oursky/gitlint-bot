import { Application } from "probot";
import { onPush } from "./listeners";
import { slackJob } from "./jobs";
import cron from "node-cron";

if (typeof process.env.SLACK_CRON_PATTERN !== "string") {
  throw new Error("Missing 'SLACK_CRON_PATTERN' env variable");
}
const SLACK_CRON_PATTERN = process.env.SLACK_CRON_PATTERN;

export = (app: Application) => {
  app.on("push", onPush);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  cron.schedule(SLACK_CRON_PATTERN, slackJob, {
    // node-cron v2+ allows tasks to return Promises: https://github.com/node-cron/node-cron/releases/tag/v2.0.0
    scheduled: true,
    timezone: "Asia/Hong_Kong",
  });
};
