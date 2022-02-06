import {getCollection} from "./connectToDB";
import {Vote} from "./schemas";
import {ObjectId} from "mongodb";

export default {
  addVote(token: string, ballotID: ObjectId, vote: string) {
    getCollection("vote").insertOne({
      token,
      ballotID,
      vote,
      votedAt: new Date()
    })
  },

  async getVote(token: string, ballotID: ObjectId): Promise<Vote> {
    return (await getCollection<Vote>("vote").findOne({token, ballotID}))
  }
}