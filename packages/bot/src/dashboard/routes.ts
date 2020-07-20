import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {
  res.send("Boilerplate Dashboard Route");
});

export default router;
