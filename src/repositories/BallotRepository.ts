import { getCollection } from "./connectToDB";
import { Ballot, VotingOption } from "./schemas";
import { ObjectId } from "mongodb";

export default {
  async addBallot(running: boolean, createdBy: string, question: string, options: VotingOption[]) {
    const result = await getCollection("ballot").insertOne({ running, createdBy, question, options });
    if (!result.acknowledged) {
      throw Error("Ballot could not be created")
    }
  },

  async deleteBallot(ballotID: string) {
    const result = await getCollection("ballot").deleteOne({ _id: new ObjectId(ballotID) });
    if (result.deletedCount !== 1) {
      throw Error("Ballot could not be deleted")
    }
  },

  async getBallot(ballotID: string): Promise<Ballot> {
    return await getCollection("ballot").findOne({
      _id: new ObjectId(ballotID),
    });
  },

  async getBallots(): Promise<Ballot[]> {
    return await getCollection<Ballot>("ballot").find().toArray();
  },

  async getRunningBallot(): Promise<Ballot> {
    return await getCollection<Ballot>("ballot").findOne({
      running: true,
    });
  },
};
