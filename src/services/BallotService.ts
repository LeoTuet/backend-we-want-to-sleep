import BallotRepository from "../repositories/BallotRepository";

export class BallotService {
  public addBallot = BallotRepository.addBallot;

  public getBallots = BallotRepository.getBallots;

  public getBallot = BallotRepository.getBallot;

  public deleteBallot = BallotRepository.deleteBallot;

  public updateBallot = BallotRepository.updateBallot;

  public getRunningBallot = BallotRepository.getRunningBallot;

  async checkIfBallotRunning(ballotID: string): Promise<boolean> {
    const ballot = await this.getBallot(ballotID);
    return ballot.running;
  }

  public async checkIfBallotIDExists(ballotID: string): Promise<boolean> {
    const ballot = await this.getBallot(ballotID);
    return ballot != null;
  }
}
