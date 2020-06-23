import * as Sentry from "@sentry/node";
import { RewriteFrames } from "@sentry/integrations";

// This must be set to project source root directory
const rootDir = __dirname || process.cwd();

export function setupLogging(): void {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: process.env.SENTRY_RELEASE,
    integrations: [
      new RewriteFrames({
        root: rootDir,
      }),
    ],
    environment: process.env.NODE_ENV ?? "development",
  });
}

export function addInvocationBreadcrumb(message: string): void {
  Sentry.addBreadcrumb({
    level: Sentry.Severity.Info,
    category: "function-call",
    message,
  });
}

export default Sentry;
