import http from "http";
import path from "path";
import { createProbot } from "probot";
import session from "express-session";
import passport from "passport";
import createMemoryStore from "memorystore";
import { ensureLoggedIn } from "connect-ensure-login";
import {
  APP_ID,
  WEBHOOK_SECRET,
  PRIVATE_KEY,
  DASHBOARD_SESSION_SECRET,
} from "./env";
import app from "./app";
import slackCommandsRoutes from "./slack/commands";
import dashboardRoutes from "./dashboard/routes";
import authRoutes from "./auth/routes";
import "./auth/setup";

const serverPort = 3000;

const probot = createProbot({
  id: APP_ID,
  port: serverPort,
  secret: WEBHOOK_SECRET,
  cert: PRIVATE_KEY,
});

probot.load(app);

const server = probot.server;

server.set("views", path.resolve(__dirname, "views"));
server.set("view engine", "pug");

const MemoryStore = createMemoryStore(session);
const sessionOpts: session.SessionOptions = {
  secret: DASHBOARD_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000, // prune expired entries every 24h
  }),
  cookie: process.env.NODE_ENV === "production" ? { secure: true } : {},
};

server.use(session(sessionOpts));
server.use(passport.initialize());
server.use(passport.session());

// Routes
server.use("/auth", authRoutes);
server.use("/commands", slackCommandsRoutes);
server.use("/dashboard", ensureLoggedIn("/auth/login"), dashboardRoutes);
server.get("/", (_, res) => res.redirect("/dashboard"));

const httpServer = http.createServer(server);
httpServer.listen(serverPort, () => {
  probot.logger.info(`Server listening on port: ${serverPort}`);
});
