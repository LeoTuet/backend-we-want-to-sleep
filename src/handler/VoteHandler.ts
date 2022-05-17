import { TotalVoteCount, VoteResult, VoteService } from "../services/VoteService"
import {TokenService} from "../services/TokenService";
import {Forbidden, NotFound, Unauthorized, UnprocessableEntity} from "http-errors";
import {Vote} from "../repositories/schemas";
import {BallotService} from "../services/BallotService";

const voteService = new VoteService()
const tokenService = new TokenService()
const ballotService = new BallotService()

export class VoteHandler {
    public async saveVote(token: string, ballotID: string, vote: string) {
        if (!await tokenService.checkIfTokenExists(token)) throw new Unauthorized("Token not found")
        if (!await tokenService.checkIfTokenValid(token)) throw new Forbidden( "Token not valid")
        if (!await ballotService.checkIfBallotIDExists(ballotID)) throw new Unauthorized("BallotID not found")
        if (!await voteService.checkIfVoteOptionValid(ballotID, vote)) throw new UnprocessableEntity( "Invalid vote option")
        if (await voteService.checkIfAlreadyVoted(ballotID, token)) throw new Forbidden( "Already voted")
        await voteService.saveVote(ballotID, token, vote)
    }

    public async getVote(token: string, ballotID: string): Promise<Vote> {
        if (!await tokenService.checkIfTokenExists(token)) throw new Unauthorized("Token not found")
        if (!await ballotService.checkIfBallotIDExists(ballotID)) throw new NotFound("BallotID not found")
        if (!await voteService.checkIfAlreadyVoted(ballotID, token)) throw new NotFound("Not voted yet")
        return (await voteService.getVote(ballotID, token))
    }

    public async getVotes(ballotID: string): Promise<Vote[]> {
        if (!await ballotService.checkIfBallotIDExists(ballotID)) throw new NotFound("BallotID not found")
        return await voteService.getVotes(ballotID)
    }

    public async getVoteResult(
      ballotID: string
    ): Promise<VoteResult[]> {
        if (!await ballotService.checkIfBallotIDExists(ballotID)) throw new NotFound("Ballot with given id does not exist");
        return await voteService.getVoteResult(ballotID)
    }

    public async getTotalVoteCount(
      ballotID: string
    ): Promise<TotalVoteCount> {
        if (!await ballotService.checkIfBallotIDExists(ballotID)) throw new NotFound("Ballot with given id does not exist");
        return await voteService.countVotes(ballotID);
    }
}
