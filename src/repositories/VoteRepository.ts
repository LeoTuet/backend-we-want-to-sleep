import { getCollection } from "./connectToDB";
import { Vote } from "./schemas";
import { ObjectId } from "mongodb";

export default {
  async addVote(ballotID: string, vote: string, votedAt: Date) {
    const result = await getCollection("vote").insertOne({
      ballotID,
      vote,
      votedAt: votedAt,
    });

    if (!result.acknowledged) throw Error("Vote could not be created");
  },

  async getVotes(): Promise<Vote[]> {
    return getCollection<Vote>("vote").find().toArray();
  },

  async getVotesForBallot(ballotID: ObjectId): Promise<Vote[]> {
    return getCollection<Vote>("vote").find({ ballotID }).toArray();
  },
};
