import { NotFound, UnprocessableEntity } from "http-errors";
import { Ballot, VotingOption } from "../repositories/schemas";
import { BallotService } from "../services/BallotService";
import { AdminService } from "../services/AdminService";

const ballotService = new BallotService();
const adminService = new AdminService();

type BallotInfo = Omit<Ballot, "createdBy">;

// dont expose admin username in response
const convertBallot = (ballot: Ballot): BallotInfo => {
  delete ballot.createdBy; // hella sus
  return ballot;
};

const convertBallots = (ballots: Ballot[]): BallotInfo[] => {
  return ballots.map(convertBallot);
};

export class BallotHandler {
  public async getBallots() {
    return convertBallots(await ballotService.getBallots());
  }

  public async addBallot(
    running: boolean,
    createdBy: string,
    question: string,
    options: VotingOption[]
  ): Promise<Ballot> {
    if (options.length < 2)
      throw new UnprocessableEntity("Not enough vote options");
    if (!(await adminService.checkIfUsernameExists(createdBy)))
      throw new UnprocessableEntity(
        "There is no admin with the given username"
      );

    return await ballotService.addBallot(running, createdBy, question, options);
  }

  public async deleteBallot(ballotID: string): Promise<void> {
    if (!(await ballotService.checkIfBallotIDExists(ballotID)))
      throw new NotFound("Ballot with given id does not exist");

    await ballotService.deleteBallot(ballotID);
  }

  public async getRunningBallot() {
    const ballot = await ballotService.getRunningBallot();
    if (!ballot) throw new NotFound("There is no running ballot");

    return convertBallot(ballot);
  }

  public async updateBallot(
    ballotID: string,
    running: boolean,
    question: string,
    options: VotingOption[]
  ): Promise<Ballot> {
    if (!(await ballotService.checkIfBallotIDExists(ballotID)))
      throw new NotFound("Ballot with given id does not exist");
    if (options.length < 2)
      throw new UnprocessableEntity("Not enough vote options");

    return await ballotService.updateBallot(ballotID, running, question, options);
  }
}
