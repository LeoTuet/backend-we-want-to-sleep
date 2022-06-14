import { Ballot, TranslatableText } from './../repositories/schemas';
import BallotRepository from "../repositories/BallotRepository";
import { VotingOption } from "../repositories/schemas";

export class BallotService {
  getBallots = BallotRepository.getBallots;

  getBallot = BallotRepository.getBallot;

  deleteBallot = BallotRepository.deleteBallot;

  getRunningBallot = BallotRepository.getRunningBallot;

  async addBallot(
    running: boolean,
    createdBy: string,
    question: TranslatableText,
    options: VotingOption[]
  ): Promise<Ballot> {
    if (running) {
      const runningBallot = await this.getRunningBallot();
      if (runningBallot != null) {
        const runningBallotId = runningBallot._id.toString();
        await BallotRepository.updateBallotRunning(runningBallotId, false);
      }
    }
    return await BallotRepository.addBallot(running, createdBy, question, options);
  }

  async updateBallot(
    ballotID: string,
    running: boolean,
    question: TranslatableText,
    options: VotingOption[]
  ): Promise<Ballot> {
    if (running) {
      const runningBallot = await this.getRunningBallot();
      if (runningBallot != null) {
        const runningBallotId = runningBallot._id.toString();
        if (ballotID != runningBallotId)
          await BallotRepository.updateBallotRunning(runningBallotId, false);
      }
    }
    return await BallotRepository.updateBallot(ballotID, running, question, options);
  }

  async checkIfBallotRunning(ballotID: string): Promise<boolean> {
    const ballot = await this.getBallot(ballotID);
    return ballot.running;
  }

  async checkIfBallotIDExists(ballotID: string): Promise<boolean> {
    const ballot = await this.getBallot(ballotID);
    return ballot != null;
  }
}
