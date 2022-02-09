import createError from "http-errors";
import { VotingOption } from "../repositories/schemas";
import { BallotService } from "../services/BallotService";

const ballotService = new BallotService();

export class BallotHandler {
  public async addBallot(running: boolean, options: VotingOption[]) {
    if (options.length < 2) throw createError(422, "Not enough vote options");
    await ballotService.addBallot(running, options);
  }

  public async deleteBallot(ballotID: string) {
    if (!(await ballotService.checkIfBallotIDExists(ballotID)))
      throw createError(400, "Ballot with given id does not exist");
    await ballotService.deleteBallot(ballotID);
  }

  public getBallots = ballotService.getBallots;

  public getRunningBallot = ballotService.getRunningBallot;
}
