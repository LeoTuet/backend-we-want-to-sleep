import { Router } from "express";
import VoteController from "../controller/VoteController";
import BallotController from "../controller/BallotController";
import TokenController from "../controller/TokenController";
import AdminController from "../controller/AdminController";
import { isAdmin } from "../middleware/AuthMiddleware";
import { isCaptchaValid } from "../middleware/CaptchaMiddleware";
import {
  adminLoginLimiter,
  defaultLimiter,
} from "../middleware/RateLimitMiddleware";

const baseRouter = Router();
baseRouter.use(defaultLimiter);

// User-route
const voteRouter = Router();
baseRouter.use("/vote", voteRouter);
voteRouter.post("/:ballotID", isCaptchaValid, VoteController.add);
voteRouter.get("/:ballotID", isAdmin, VoteController.listByBallot);
voteRouter.get("/:ballotID/:token", VoteController.getByToken);

const ballotRouter = Router();
baseRouter.use("/ballot", ballotRouter);
ballotRouter.get("/", BallotController.list);
ballotRouter.post("/", isAdmin, BallotController.add);
ballotRouter.delete("/", isAdmin, BallotController.delete);
ballotRouter.get("/running", BallotController.listRunning);
ballotRouter.put("/:ballotID", isAdmin, BallotController.put);
ballotRouter.get("/result/:ballotID", isAdmin, BallotController.getVoteResult);
ballotRouter.get("/status/:ballotID", BallotController.getTotalVoteCount);

const tokenRouter = Router();
baseRouter.use("/token", tokenRouter);
tokenRouter.get("/status/:ballotID/:token", TokenController.getStatus);
tokenRouter.post("/", isAdmin, TokenController.generate);

const adminRouter = Router();
baseRouter.use("/admin", adminRouter);
adminRouter.post("/login", adminLoginLimiter, AdminController.login);
adminRouter.post("/", isAdmin, AdminController.add);
adminRouter.delete("/", isAdmin, AdminController.delete);

// Export the base-router
export default baseRouter;
