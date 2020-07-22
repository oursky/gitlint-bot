import { Router } from "express";
import { getRepositorySummary } from "./controllers";

const router = Router();

router.get("/", async (_, res) => {
  const summary = await getRepositorySummary();
  console.log(summary);
  res.render("dashboard");
});

export default router;
