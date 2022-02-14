import {UnprocessableEntity} from "http-errors";
import {TokenService} from "../services/TokenService";
import {VoteService} from "../services/VoteService";
import {generateTokens} from "../utils/generateTokens";
import {AdminService} from "../services/AdminService";

const voteService = new VoteService()
const tokenService = new TokenService()
const adminService = new AdminService()

export class TokenHandler {
  public async generateTokens(amount: number, valid: boolean, createdBy: string): Promise<string[]> {
    if (!await adminService.checkIfUsernameExists(createdBy))
      throw new UnprocessableEntity("There is no admin with the given username")
    const tokens = generateTokens(amount)
    await tokenService.addTokens(tokens, valid, createdBy)
    return tokens
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
