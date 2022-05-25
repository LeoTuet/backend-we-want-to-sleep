import { Vote } from "../repositories/schemas";
import BallotRepository from "../repositories/BallotRepository";
import VoteRepository from "../repositories/VoteRepository";
import { ObjectId } from "mongodb";

export interface VoteResult {
  questionIdentifier: string;
  questionLabel: string;
  amount: number;
}

export interface TotalVoteCount {
  count: number;
}

export class VoteService {
  public async saveVote(ballotID: string, token: string, vote: string) {
    const ballot = await BallotRepository.getBallot(ballotID);
    await VoteRepository.addVote(token, ballot._id, vote, new Date());
  }

  public async getVote(ballotID: string, token: string): Promise<Vote> {
    return await VoteRepository.getVote(token, new ObjectId(ballotID));
  }

  public async getVotes(ballotID: string): Promise<Vote[]> {
    return await VoteRepository.getVotes(new ObjectId(ballotID));
  }

  public async checkIfAlreadyVoted(
    ballotID: string,
    token: string
  ): Promise<boolean> {
    const vote = await this.getVote(ballotID, token);
    return vote != null;
  }

  public async checkIfVoteOptionValid(
    ballotID: string,
    vote: string
  ): Promise<boolean> {
    const ballot = await BallotRepository.getBallot(ballotID);
    return ballot.options.map((option) => option.identifier).includes(vote);
  }

  public async countVotes(ballotID: string): Promise<TotalVoteCount> {
    const votes = await this.getVotes(ballotID);
    return {
      count: votes.length,
    };
  }

  public async getVoteResult(ballotID: string): Promise<VoteResult[]> {
    const votes = await this.getVotes(ballotID);
    const ballot = await BallotRepository.getBallot(ballotID);
    const voteOptions = ballot.options;

    const results: Record<string, number> = {} as never;

    // init vote counter
    for (const voteOption of voteOptions) {
      results[voteOption.identifier] = 0;
    }

    // count votes
    for (const vote of votes) {
      results[vote.vote]++;
    }

    // fill records into array list
    const out: VoteResult[] = [];
    for (const result of Object.keys(results)) {
      const voteOption = voteOptions.find((vo) => result == vo.identifier);
      const voteResult = {
        questionIdentifier: voteOption.identifier,
        questionLabel: voteOption.label,
        amount: results[result],
      };
      out.push(voteResult);
    }
    return out;
  }
}
