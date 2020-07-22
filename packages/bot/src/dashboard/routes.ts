import { Router } from "express";
import { getRepositorySummary } from "./controllers";

const router = Router();

router.get("/", async (_, res) => {
  const repoSummary = await getRepositorySummary();
  res.render("dashboard", {
    title: "Dashboard",
    repositories: repoSummary,
  });
});

export default router;
