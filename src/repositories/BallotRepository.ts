import { getCollection } from "./connectToDB";
import { Ballot, VotingOption } from "./schemas";
import { ObjectId } from "mongodb";

export default {
  async addBallot(running: boolean, createdBy: string, question: string, options: VotingOption[]) {
    await getCollection("ballot").insertOne({ running, createdBy, question, options });
  },

  async deleteBallot(ballotID: string) {
    await getCollection("ballot").deleteOne({ _id: new ObjectId(ballotID) });
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
