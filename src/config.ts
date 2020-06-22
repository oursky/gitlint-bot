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

export const SLACK_CRON_PATTERN = getEnvString("SLACK_CRON_PATTERN");
export const SLACK_WEBHOOK_URL = getEnvString("SLACK_WEBHOOK_URL");
export const SLACK_DAY_INTERVAL = getEnvInteger("SLACK_DAY_INTERVAL");
