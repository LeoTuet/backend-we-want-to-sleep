import createHttpError from "http-errors";
import BallotRepository from "../repositories/BallotRepository";

export class BallotService {
  public addBallot = BallotRepository.addBallot;

  public getBallots = BallotRepository.getBallots;

  public getBallot = BallotRepository.getBallot;

  public deleteBallot = BallotRepository.deleteBallot;

  public getRunningBallot = async () => {
    const ballot = await BallotRepository.getRunningBallot();

    if (ballot) {
      return ballot;
    } else {
      throw new createHttpError.NotFound();
    }
  };

  public async checkIfBallotIDExists(ballotID: string): Promise<boolean> {
    return (await this.getBallot(ballotID)) != null;
  }
}
