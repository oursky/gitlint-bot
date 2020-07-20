import http from "http";
import { createProbot } from "probot";
import { APP_ID, WEBHOOK_SECRET, PRIVATE_KEY } from "./env";
import app from "./app";

const serverPort = 3000;

const probot = createProbot({
  id: APP_ID,
  port: serverPort,
  secret: WEBHOOK_SECRET,
  cert: PRIVATE_KEY,
});

probot.load(app);

const expressServer = probot.server;

const server = http.createServer(expressServer);
server.listen(serverPort, () => {
  probot.logger.info(`Server listening on port: ${serverPort}`);
});
