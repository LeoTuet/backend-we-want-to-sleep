import { Vote, VotingOption } from "../repositories/schemas";
import BallotRepository from "../repositories/BallotRepository";
import VoteRepository from "../repositories/VoteRepository";
import { ObjectId } from "mongodb";

export interface VoteResult {
  questionIdentifier: string,
  questionLabel: string,
  amount: number
}

export interface TotalVoteCount {
  count: number
}

export class VoteService {
  public async saveVote(ballotID: string, token: string, vote: string) {
    await VoteRepository.addVote(
      token,
      (await BallotRepository.getBallot(ballotID))._id,
      vote,
      new Date()
    );
  }

  public async getVote(ballotID: string, token: string): Promise<Vote> {
    return await VoteRepository.getVote(token, new ObjectId(ballotID));
  }

  public async getVotes(ballotID: string): Promise<Vote[]> {
    return await VoteRepository.getVotes(new ObjectId(ballotID))
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

  public async countVotes(
    ballotID: string
  ): Promise<TotalVoteCount> {
    const votes = await this.getVotes(ballotID);
    return {
      count: votes.length
    };
  }

  public async getVoteResult(
    ballotID: string,
    voteOptions: VotingOption[]
  ): Promise<VoteResult[]> {
    const votes = await this.getVotes(ballotID);

    const results: Record<string, number> = {} as never

    // init vote counter
    for (const voteOption of voteOptions) {
      results[voteOption.identifier] = 0
    }

    // count votes
    for (const vote of votes) {
      results[vote.vote]++;
    }

    // fill records into array list
    const out: VoteResult[] = [];
    for (const result of Object.keys(results)) {
      const voteOption = voteOptions.find(vo => result == vo.identifier)
      const vr: VoteResult = {
        questionIdentifier: voteOption.identifier,
        questionLabel: voteOption.label,
        amount: results[result]
      }
      out.push(vr);
    }
    return out;
  }
}
