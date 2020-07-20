import { Router } from "express";
import passport from "passport";
import session from "express-session";
import { DASHBOARD_SESSION_SECRET } from "../env";
import "./setupAuth";

const router = Router();

router.use(
  session({
    secret: DASHBOARD_SESSION_SECRET,
    resave: false,
    cookie: { secure: true },
  })
);
router.use(passport.initialize());
router.use(passport.session());
router.get("/", (_, res) => {
  res.send("Boilerplate Dashboard Route");
});

export default router;
