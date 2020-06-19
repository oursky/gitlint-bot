import * as Sentry from "@sentry/node";
import { RewriteFrames } from "@sentry/integrations";

// This must be set to project source root directory
const rootDir = __dirname || process.cwd();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new RewriteFrames({
      root: rootDir,
    }),
  ],
});
