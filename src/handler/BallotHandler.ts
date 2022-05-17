import createHttpError, { NotFound, UnprocessableEntity } from "http-errors";
import { VotingOption } from "../repositories/schemas";
import { BallotService } from "../services/BallotService";
import { TotalVoteCount, VoteResult, VoteService } from "../services/VoteService";
import { AdminService } from "../services/AdminService";
import BallotRepository from "../repositories/BallotRepository";

const ballotService = new BallotService();
const adminService = new AdminService();
const voteService = new VoteService();

export class BallotHandler {
  public async addBallot(
    running: boolean,
    createdBy: string,
    question: string,
    options: VotingOption[]
  ): Promise<void> {
    if (options.length < 2)
      throw new UnprocessableEntity("Not enough vote options");
    if (!(await adminService.checkIfUsernameExists(createdBy)))
      throw new UnprocessableEntity(
        "There is no admin with the given username"
      );

    await ballotService.addBallot(running, createdBy, question, options);
  }

  public async deleteBallot(ballotID: string): Promise<void> {
    if (!(await ballotService.checkIfBallotIDExists(ballotID)))
      throw new NotFound("Ballot with given id does not exist");

    await ballotService.deleteBallot(ballotID);
  }

  public getBallots = ballotService.getBallots;

  public getRunningBallot = async () => {
    const ballot = await BallotRepository.getRunningBallot();

    if (!ballot) {
      throw new createHttpError.NotFound("There is no running ballot");
    }

    return ballot;
  };

  public async updateBallot(
    ballotID: string,
    running: boolean,
    question: string,
    options: VotingOption[]
  ): Promise<void> {
    if (!(await ballotService.checkIfBallotIDExists(ballotID)))
      throw new NotFound("Ballot with given id does not exist");
    if (options.length < 2)
      throw new UnprocessableEntity("Not enough vote options");

    await ballotService.updateBallot(ballotID, running, question, options);
  }

  public async getVoteResult(
    ballotID: string
  ): Promise<VoteResult[]> {
    if (!(await ballotService.checkIfBallotIDExists(ballotID)))
      throw new NotFound("Ballot with given id does not exist");

    const ballot = await ballotService.getBallot(ballotID);

    return await voteService.getVoteResult(ballotID, ballot.options)
  }

  public async getTotalVoteCount(
    ballotID: string
  ): Promise<TotalVoteCount> {
    if (!(await ballotService.checkIfBallotIDExists(ballotID)))
      throw new NotFound("Ballot with given id does not exist");

    return await voteService.countVotes(ballotID);
  }
}
