import { NotFound, UnprocessableEntity, Conflict } from "http-errors";
import { Ballot, TranslatableText, VotingOption } from "../repositories/schemas";
import { BallotService } from "../services/BallotService";
import { AdminService } from "../services/AdminService";

const ballotService = new BallotService();
const adminService = new AdminService();

type BallotInfo = Omit<Ballot, "createdBy">;

// dont expose admin username or tokens in response
const convertBallot = (ballot: Ballot): BallotInfo => {
  delete ballot.createdBy; // hella sus
  delete ballot.tokensUsed;
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
    question: TranslatableText,
    options: VotingOption[]
  ): Promise<BallotInfo> {
    if (options.length < 2)
      throw new UnprocessableEntity("Not enough vote options");
    if (!(await adminService.checkIfUsernameExists(createdBy)))
      throw new UnprocessableEntity(
        "There is no admin with the given username"
      );

    const ballot = await ballotService.addBallot(
      running,
      createdBy,
      question,
      options
    );
    return convertBallot(ballot);
  }

  public async deleteBallot(ballotID: string): Promise<void> {
    if (!(await ballotService.checkIfBallotIDExists(ballotID)))
      throw new NotFound("Ballot with given id does not exist");

    if (await ballotService.checkIfBallotRunning(ballotID))
      throw new Conflict("Ballot is running and therefore it can't be deleted");

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
    question: TranslatableText,
    options: VotingOption[]
  ): Promise<BallotInfo> {
    if (!(await ballotService.checkIfBallotIDExists(ballotID)))
      throw new NotFound("Ballot with given id does not exist");
    if (options.length < 2)
      throw new UnprocessableEntity("Not enough vote options");

    const ballot = await ballotService.updateBallot(
      ballotID,
      running,
      question,
      options
    );
    return convertBallot(ballot);
  }
}
