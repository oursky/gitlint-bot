import { Router, Request } from "express";
import {
  getRepositorySummary,
  getViolatedCommits,
  getCommitCounts,
} from "./controllers";

const router = Router();

router.get("/", async (req: Request, res) => {
  const repoSummary = await getRepositorySummary();
  const pageNumber =
    typeof req.query.page !== "undefined" ? Number(req.query.page) : 1;
  const commits = await getViolatedCommits(pageNumber);
  const { totalCount, pageCount } = await getCommitCounts();
  res.render("dashboard", {
    title: "Dashboard",
    repositories: repoSummary,
    commits,
    pageCount,
    totalCount,
    currPage: pageNumber,
  });
});

export default router;
