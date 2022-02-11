import {Router} from "express";
import VoteController from "../controller/VoteController";
import BallotController from "../controller/BallotController";
import TokenController from "../controller/TokenController";
import AdminController from "../controller/AdminController";
import {isAdmin} from "../utils/AuthMiddleware";
import {isCaptchaValid} from "../middleware/CaptchaMiddleware";
import { adminLoginLimiter, defaultLimiter } from "../middleware/RateLimitMiddleware";

// User-route
const voteRouter = Router();
voteRouter.post("/:ballotID", isCaptchaValid, VoteController.add);
voteRouter.get("/:ballotID/:token", VoteController.get);

const ballotRouter = Router();
ballotRouter.get("/", BallotController.list);
ballotRouter.post("/", isAdmin, BallotController.add);
ballotRouter.delete("/", isAdmin, BallotController.delete);
ballotRouter.get("/running", BallotController.listRunning);

const tokenRouter = Router();
tokenRouter.get("/status/:ballotID/:token", TokenController.getStatus);

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
