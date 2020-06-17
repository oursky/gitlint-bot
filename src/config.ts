function getEnvVariable(varName: string): string {
  const envVar = process.env[varName];
  if (typeof envVar !== "string") {
    throw new Error(`Missing '${varName}' env variable`);
  }
  return envVar;
}
export const SLACK_CRON_PATTERN = getEnvVariable("SLACK_CRON_PATTERN");
export const SLACK_WEBHOOK_URL = getEnvVariable("SLACK_WEBHOOK_URL");
