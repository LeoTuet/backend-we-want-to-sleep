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

// User-route
const voteRouter = Router();
voteRouter.post("/:ballotID", isCaptchaValid, VoteController.add);
voteRouter.get("/:ballotID", isAdmin, VoteController.listByBallot);
voteRouter.get("/:ballotID/:token", VoteController.getByToken);

const ballotRouter = Router();
ballotRouter.get("/", BallotController.list);
ballotRouter.post("/", isAdmin, BallotController.add);
ballotRouter.delete("/", isAdmin, BallotController.delete);
ballotRouter.get("/running", BallotController.listRunning);
ballotRouter.put("/:ballotID", isAdmin, BallotController.put);
ballotRouter.get("/result/:ballotID", isAdmin, BallotController.getAdminStatus);
ballotRouter.get("/status/:ballotID", BallotController.getTotalVoteCount);

const tokenRouter = Router();
tokenRouter.get("/status/:ballotID/:token", TokenController.getStatus);
tokenRouter.post("/", isAdmin, TokenController.generate);

const adminRouter = Router();
adminRouter.post("/login", adminLoginLimiter, AdminController.login);
adminRouter.post("/", isAdmin, AdminController.add);
adminRouter.delete("/", isAdmin, AdminController.delete);

// Export the base-router
const baseRouter = Router();
baseRouter.use(defaultLimiter);
baseRouter.use("/vote", voteRouter);
baseRouter.use("/ballot", ballotRouter);
baseRouter.use("/token", tokenRouter);
baseRouter.use("/admin", adminRouter);
export default baseRouter;
