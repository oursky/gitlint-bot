import { Router, Request } from "express";
import {
  getRepositorySummary,
  getViolatedCommits,
  getCommitCounts,
  getDetailedCommit,
} from "./controllers";
import { ErrorWithStatus } from "../types/errors";

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
  const commit = await getDetailedCommit(req.params.commitId);
  if (commit === null) {
    const error: ErrorWithStatus = new Error(
      `Commit with ID not found: ${req.params.commitId}`
    );
    error.status = 404;
    next(error);
  } else {
    res.render("commit", {
      commit,
      title: "Detailed Commit",
    });
  }
});

export default router;
