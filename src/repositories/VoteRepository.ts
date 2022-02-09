import {getCollection} from "./connectToDB";
import {Vote} from "./schemas";
import {ObjectId} from "mongodb";

export default {
  addVote(token: string, ballotID: string, vote: string, votedAt: Date) {
    getCollection("vote").insertOne({
      token,
      ballotID,
      vote,
      votedAt: votedAt
    })
  },

  async getVote(token: string, ballotID: ObjectId): Promise<Vote> {
    return (await getCollection<Vote>("vote").findOne({token, ballotID}))
  }
}