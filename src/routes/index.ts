import { Router } from "express";
import VoteController from "../controller/VoteController";
import BallotController from "../controller/BallotController";
import TokenController from "../controller/TokenController";

// User-route
const voteRouter = Router();
voteRouter.post("/:ballotID", VoteController.add);
voteRouter.get("/:ballotID/:token", VoteController.get);

const ballotRouter = Router();
ballotRouter.get("/", BallotController.list);
ballotRouter.get("/running", BallotController.listRunning);
ballotRouter.post("/", BallotController.add);
ballotRouter.delete("/running", BallotController.delete);

const tokenRouter = Router();
tokenRouter.get("/status/:ballotID/:token", TokenController.getStatus);

// Export the base-router
const baseRouter = Router();
baseRouter.use("/vote", voteRouter);
baseRouter.use("/ballot", ballotRouter);
baseRouter.use("/token", tokenRouter);
export default baseRouter;
