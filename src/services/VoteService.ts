import { Vote } from "../repositories/schemas";
import BallotRepository from "../repositories/BallotRepository";
import VoteRepository from "../repositories/VoteRepository";
import { ObjectId } from "mongodb";

export class VoteService {
  public async saveVote(ballotID: string, token: string, vote: string) {
    VoteRepository.addVote(
      token,
      (await BallotRepository.getBallot(ballotID))._id,
      vote,
      new Date()
    );
  }

  public async getVote(ballotID: string, token: string): Promise<Vote> {
    return await VoteRepository.getVote(token, new ObjectId(ballotID));
  }

  public async checkIfAlreadyVoted(
    ballotID: string,
    token: string
  ): Promise<boolean> {
    return (await this.getVote(ballotID, token)) != null;
  }

  public async checkIfVoteOptionValid(
    ballotID: string,
    vote: string
  ): Promise<boolean> {
    return (await BallotRepository.getBallot(ballotID)).options
      .map((option) => option.identifier)
      .includes(vote);
  }
}
