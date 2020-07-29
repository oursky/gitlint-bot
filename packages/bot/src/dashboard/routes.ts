import { Router, Request } from "express";
import {
  getRepositorySummary,
  getViolatedCommits,
  getCommitCounts,
  getCommit,
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

router.get("/commit/:commitId", async (req: Request, res, next) => {
  const commit = await getCommit(req.params.commitId);
  if (typeof commit === "undefined") {
    next(new Error(`Commit with ID not found: ${req.params.commitId}`));
  }
  res.json(commit);
});

export default router;
