import { getCollection } from "./connectToDB";
import { Vote } from "./schemas";
import { ObjectId } from "mongodb";

export default {
  async addVote(token: string, ballotID: string, vote: string, votedAt: Date) {
    const result = await getCollection("vote").insertOne({
      token,
      ballotID,
      vote,
      votedAt: votedAt,
    });

    if (!result.acknowledged) throw Error("Vote could not be created");
  },

  async getVote(token: string, ballotID: ObjectId): Promise<Vote> {
    return await getCollection<Vote>("vote").findOne({ token, ballotID });
  },

  async getVotes(ballotID: ObjectId): Promise<Vote[]> {
    return getCollection<Vote>("vote").find({ ballotID }).toArray();
  },
};
