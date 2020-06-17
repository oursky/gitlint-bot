function getEnvVariable(varName: string): string {
  const envVar = process.env[varName];
  if (typeof envVar !== "string") {
    throw new Error(`Missing '${varName}' env variable`);
  }
  return envVar;
}
export const SLACK_CRON_PATTERN = getEnvVariable("SLACK_CRON_PATTERN");
export const SLACK_WEBHOOK_URL = getEnvVariable("SLACK_WEBHOOK_URL");
export const SLACK_DAY_INTERVAL = parseInt(
  getEnvVariable("SLACK_DAY_INTERVAL"),
  10
); // Number of days in between successive Slack summary messages
