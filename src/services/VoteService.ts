import { Vote } from "../repositories/schemas";
import BallotRepository from "../repositories/BallotRepository";
import VoteRepository from "../repositories/VoteRepository";

export interface VoteResult {
  questionIdentifier: string;
  questionLabel: string;
  amount: number;
}

export interface TotalVoteCount {
  count: number;
}

export class VoteService {
  getVotesForBallot = VoteRepository.getVotesForBallot;

  public async saveVote(ballotID: string, token: string, vote: string) {
    await VoteRepository.addVote(ballotID, vote, new Date());
    await BallotRepository.setTokenAsUsed(ballotID, token);
  }

  public async checkIfAlreadyVoted(
    ballotID: string,
    token: string
  ): Promise<boolean> {
    return BallotRepository.checkIfTokenIsUsed(ballotID, token);
  }

  public async checkIfVoteOptionValid(
    ballotID: string,
    vote: string
  ): Promise<boolean> {
    const ballot = await BallotRepository.getBallot(ballotID);
    return ballot.options.map((option) => option.identifier).includes(vote);
  }

  public async countVotesForBallot(ballotID: string): Promise<TotalVoteCount> {
    const votes = await this.getVotesForBallot(ballotID);
    return {
      count: votes.length,
    };
  }

  public async getVoteResult(ballotID: string): Promise<VoteResult[]> {
    const votes = await this.getVotesForBallot(ballotID);
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
