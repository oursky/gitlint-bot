function getEnvString(varName: string): string {
  const envVar = process.env[varName];
  if (typeof envVar !== "string") {
    throw new Error(`Missing '${varName}' env variable`);
  }
  return envVar;
}

function getEnvInteger(varName: string): number {
  const parsedValue = Number(getEnvString(varName));
  if (Number.isNaN(parsedValue) || !Number.isSafeInteger(parsedValue)) {
    throw new Error(`'${varName}' env variable must be an integer`);
  }
  return parsedValue;
}

export const APP_ID = getEnvInteger("APP_ID");
export const WEBHOOK_SECRET = getEnvString("WEBHOOK_SECRET");
export const PRIVATE_KEY = getEnvString("PRIVATE_KEY");
export const SLACK_SIGNING_SECRET = getEnvString("SLACK_SIGNING_SECRET");
export const SLACK_CRON_PATTERN = getEnvString("SLACK_CRON_PATTERN");
export const SLACK_WEBHOOK_URL = getEnvString("SLACK_WEBHOOK_URL");
export const SLACK_DAY_INTERVAL = getEnvInteger("SLACK_DAY_INTERVAL");
export const GOOGLE_CLIENT_ID = getEnvString("GOOGLE_CLIENT_ID");
export const GOOGLE_CLIENT_SECRET = getEnvString("GOOGLE_CLIENT_SECRET");
export const GOOGLE_CALLBACK_URL = getEnvString("GOOGLE_CALLBACK_URL");
export const DASHBOARD_SESSION_SECRET = getEnvString(
  "DASHBOARD_SESSION_SECRET"
);
