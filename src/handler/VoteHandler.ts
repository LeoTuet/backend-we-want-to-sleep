import {VoteService} from "../services/VoteService"
import {TokenService} from "../services/TokenService";
import createError from "http-errors";
import {Vote} from "../repositories/schemas";
import {BallotService} from "../services/BallotService";

const voteService = new VoteService()
const tokenService = new TokenService()
const ballotService = new BallotService()

export class VoteHandler {
    public async saveVote(token: string, ballotID: string, vote: string) {
        if (!await tokenService.checkIfTokenExists(token)) throw createError(401, "Token not found")
        if (!await tokenService.checkIfTokenValid(token)) throw createError(403, "Token not valid")
        if (!await ballotService.checkIfBallotIDExists(ballotID)) throw createError(401, "BallotID not found")
        if (!await voteService.checkIfVoteOptionValid(ballotID, vote)) throw createError(422, "Invalid vote option")
        if (await voteService.checkIfAlreadyVoted(ballotID, token)) throw createError(403, "Already voted")
        await voteService.saveVote(ballotID, token, vote)
    }

    public async getVote(token: string, ballotID: string): Promise<Vote> {
        if (!await tokenService.checkIfTokenExists(token)) throw createError(401, "Token not found")
        if (!await ballotService.checkIfBallotIDExists(ballotID)) throw createError(401, "BallotID not found")
        if (!await voteService.checkIfAlreadyVoted(ballotID, token)) throw createError(403, "Not voted yet")
        return (await voteService.getVote(ballotID, token))
    }
}
