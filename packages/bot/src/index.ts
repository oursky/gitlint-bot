import http from "http";
import { createProbot } from "probot";
import session from "express-session";
import passport from "passport";
import {
  APP_ID,
  WEBHOOK_SECRET,
  PRIVATE_KEY,
  DASHBOARD_SESSION_SECRET,
} from "./env";
import app from "./app";
import slackCommandsRoutes from "./slack/commands";
import dashboardRoutes from "./dashboard/routes";
import "./setupAuth";

const serverPort = 3000;

const probot = createProbot({
  id: APP_ID,
  port: serverPort,
  secret: WEBHOOK_SECRET,
  cert: PRIVATE_KEY,
});

probot.load(app);

const server = probot.server;

server.use(
  session({
    secret: DASHBOARD_SESSION_SECRET,
    resave: false,
    cookie: { secure: true },
  })
);
server.use(passport.initialize());
server.use(passport.session());

// Routes
server.use("/commands", slackCommandsRoutes);
server.use("/dashboard", dashboardRoutes);
server.get("/", (_, res) => res.redirect("/dashboard"));

const httpServer = http.createServer(server);
httpServer.listen(serverPort, () => {
  probot.logger.info(`Server listening on port: ${serverPort}`);
});
