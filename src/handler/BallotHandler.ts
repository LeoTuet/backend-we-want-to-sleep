import { NotFound, UnprocessableEntity } from "http-errors";
import { VotingOption } from "../repositories/schemas";
import { BallotService } from "../services/BallotService";
import { VoteService } from "../services/VoteService";
import { AdminService } from "../services/AdminService";

const ballotService = new BallotService();
const adminService = new AdminService();
const voteService = new VoteService();

export interface VoteResult {
  questionIdentifier: string,
  questionLabel: string,
  amount: number
}

export interface TotalVoteCount {
  count: number
}

export class BallotHandler {
  public async addBallot(
    running: boolean,
    createdBy: string,
    question: string,
    options: VotingOption[]
  ): Promise<void> {
    if (options.length < 2)
      throw new UnprocessableEntity("Not enough vote options");
    if (!(await adminService.checkIfUsernameExists(createdBy)))
      throw new UnprocessableEntity(
        "There is no admin with the given username"
      );

    await ballotService.addBallot(running, createdBy, question, options);
  }

  public async deleteBallot(ballotID: string): Promise<void> {
    if (!(await ballotService.checkIfBallotIDExists(ballotID)))
      throw new NotFound("Ballot with given id does not exist");

    await ballotService.deleteBallot(ballotID);
  }

  public getBallots = ballotService.getBallots;

  public getRunningBallot = ballotService.getRunningBallot;

  public async updateBallot(
    ballotID: string,
    running: boolean,
    question: string,
    options: VotingOption[]
  ): Promise<void> {
    if (!(await ballotService.checkIfBallotIDExists(ballotID)))
      throw new NotFound("Ballot with given id does not exist");
    if (options.length < 2)
      throw new UnprocessableEntity("Not enough vote options");

    await ballotService.updateBallot(ballotID, running, question, options);
  }

  public async getAdminStatus(
    ballotID: string
  ): Promise<VoteResult[]> {
    if (!(await ballotService.checkIfBallotIDExists(ballotID)))
      throw new NotFound("Ballot with given id does not exist");

    const ballot = await ballotService.getBallot(ballotID);
    const votes = await voteService.getVotes(ballotID);

    const results: Record<string, number> = {} as never

    // init vote counter
    for (const voteOption of ballot.options) {
      results[voteOption.identifier] = 0
    }

    // count votes
    for (const vote of votes) {
      results[vote.vote]++;
    }

    // fill records into array list
    const out: VoteResult[] = [];
    for (const result of Object.getOwnPropertyNames(results)) {
      const voteOption = ballot.options.find(vo => result == vo.identifier)
      const vr: VoteResult = {
        questionIdentifier: voteOption.identifier,
        questionLabel: voteOption.label,
        amount: results[result]
      }
      out.push(vr);
    }
    return out;
  }

  public async getTotalVoteCount(
    ballotID: string
  ): Promise<TotalVoteCount> {
    if (!(await ballotService.checkIfBallotIDExists(ballotID)))
      throw new NotFound("Ballot with given id does not exist");

    const votes = await voteService.getVotes(ballotID);

    return {
      count: votes.length
    } as TotalVoteCount;
  }
}
