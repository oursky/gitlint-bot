import passport from "passport";
import { Router } from "express";

const router = Router();

router.get("/login", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
  })
);

export default router;
