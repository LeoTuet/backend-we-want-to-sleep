import BallotRepository from "../repositories/BallotRepository";

export class BallotService {
  public addBallot = BallotRepository.addBallot

  public getBallots = BallotRepository.getBallots

  public getBallot = BallotRepository.getBallot

  public deleteBallot = BallotRepository.deleteBallot

  public getRunningBallots = BallotRepository.getRunningBallots

  public async checkIfBallotIDExists(ballotID: string): Promise<boolean> {
    return (await this.getBallot(ballotID)) != null
  }
}