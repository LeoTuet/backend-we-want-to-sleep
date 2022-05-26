import { Router } from "express";
import VoteController from "../controller/VoteController";
import BallotController from "../controller/BallotController";
import TokenController from "../controller/TokenController";
import AdminController from "../controller/AdminController";
import AuthController from "../controller/AuthController";
import MetricsController from "../controller/MetricsController";
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
voteRouter.get("/:ballotID", isAdmin, VoteController.listByBallot);
voteRouter.get("/:ballotID/:token", VoteController.getByToken);
voteRouter.post("/:ballotID", isCaptchaValid, VoteController.add);

const ballotRouter = Router();
baseRouter.use("/ballot", ballotRouter);
ballotRouter.get("/", BallotController.list);
ballotRouter.get("/running", BallotController.listRunning);
ballotRouter.get("/status/:ballotID", BallotController.getTotalVoteCount);

ballotRouter.get("/result/:ballotID", isAdmin, BallotController.getVoteResult);
ballotRouter.post("/", isAdmin, BallotController.add);
ballotRouter.put("/:ballotID", isAdmin, BallotController.put);
ballotRouter.delete("/", isAdmin, BallotController.delete);

const tokenRouter = Router();
baseRouter.use("/token", tokenRouter);
tokenRouter.get("/status/:ballotID/:token", TokenController.getStatus);
tokenRouter.post("/", isAdmin, TokenController.generate);

const adminRouter = Router();
baseRouter.use("/admin", adminRouter);
adminRouter.post("/login", adminLoginLimiter, AuthController.login); // old login endpoint
adminRouter.post("/", isAdmin, AdminController.add);
adminRouter.delete("/", isAdmin, AdminController.delete);

const authRouter = Router();
baseRouter.use("/auth", authRouter);
authRouter.post("/login", adminLoginLimiter, AuthController.login);

const metricsRouter = Router();
baseRouter.use("/metrics", metricsRouter);
metricsRouter.get("/", MetricsController.getAllMetrics);

// Export the base-router
export default baseRouter;
