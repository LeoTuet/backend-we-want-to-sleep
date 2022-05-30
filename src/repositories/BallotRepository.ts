import { getCollection } from "./connectToDB";
import { Ballot, VotingOption } from "./schemas";
import { ObjectId } from "mongodb";

export default {
  async addBallot(
    running: boolean,
    createdBy: string,
    question: string,
    options: VotingOption[]
  ): Promise<void> {
    const result = await getCollection("ballot").insertOne({
      running,
      createdBy,
      question,
      options,
      tokensUsed: [],
    });

    if (!result.acknowledged) throw Error("Ballot could not be created");
  },

  async deleteBallot(ballotID: string): Promise<void> {
    const result = await getCollection("ballot").deleteOne({
      _id: new ObjectId(ballotID),
    });

    if (result.deletedCount !== 1) throw Error("Ballot could not be deleted");
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
  async updateBallot(
    ballotID: string,
    running: boolean,
    question: string,
    options: VotingOption[]
  ): Promise<void> {
    const result = await getCollection("ballot").updateOne(
      { _id: new ObjectId(ballotID) },
      {
        $set: {
          running,
          question,
          options,
        },
      }
    );

    if (!result.acknowledged) throw Error("Ballot could not be updated");
  },
  async updateBallotRunning(ballotID: string, running: boolean): Promise<void> {
    const result = await getCollection("ballot").updateOne(
      { _id: new ObjectId(ballotID) },
      {
        $set: {
          running,
        },
      }
    );

    if (!result.acknowledged) throw Error("Ballot could not be updated");
  },
  async setTokenAsUsed(ballotId: string, token: string): Promise<void> {
    const result = await getCollection("ballot").updateOne(
      { _id: new ObjectId(ballotId) },
      {
        $push: {
          tokensUsed: token,
        },
      }
    );

    if (!result.acknowledged) throw Error("Token could not be set as used");
  },
  async checkIfTokenIsUsed(ballotId: string, token: string): Promise<boolean> {
    return (
      (await getCollection("ballot")
        .find({
          _id: new ObjectId(ballotId),
          tokensUsed: { $elemMatch: { $eq: token } },
        })
        .count()) > 0
    );
  },
};
