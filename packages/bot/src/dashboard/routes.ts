import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  res.render("dashboard");
});

export default router;
