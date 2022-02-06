import createError from "http-errors";
import {TokenService} from "../services/TokenService";
import {VoteService} from "../services/VoteService";

const voteService = new VoteService()
const tokenService = new TokenService()

export class TokenHandler {
  public async addToken(token: string, valid: boolean) {
    if (await tokenService.checkIfTokenExists(token)) throw createError(400, "Token already exists")
    tokenService.addToken(token, valid)
  }

  public async deleteToken(token: string) {
    if (!await tokenService.checkIfTokenExists(token)) throw createError(400, "Token does not exist")
    tokenService.deleteToken(token)
  }

  public async getTokenStatus(token: string, ballotID: string) {
    const exists = await tokenService.checkIfTokenExists(token)
    const valid = exists && await tokenService.checkIfTokenValid(token)
    const used = valid && await voteService.checkIfAlreadyVoted(ballotID, token)
    return {
      exists,
      valid,
      used
    }
  }
}