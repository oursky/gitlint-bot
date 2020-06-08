import { Application } from "probot";
import { onPush } from "./listeners";

export = (app: Application) => {
  app.on("push", onPush);
};
