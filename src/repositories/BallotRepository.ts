import { getCollection } from "./connectToDB";
import { Ballot, VotingOption } from "./schemas";
import { ObjectId } from "mongodb";

async function getBallot(ballotID: string): Promise<Ballot> {
  return await getCollection("ballot").findOne({
    _id: new ObjectId(ballotID),
  });
}

async function getBallots(): Promise<Ballot[]> {
  return await getCollection<Ballot>("ballot").find().toArray();
}

async function getRunningBallot(): Promise<Ballot> {
  return await getCollection<Ballot>("ballot").findOne({
    running: true,
  });
}

async function addBallot(
  running: boolean,
  createdBy: string,
  question: string,
  options: VotingOption[]
): Promise<Ballot> {
  const result = await getCollection("ballot").insertOne({
    running,
    createdBy,
    question,
    options,
  });

  if (!result.acknowledged) throw Error("Ballot could not be created");
  return await getBallot(result.insertedId.toString());
}

async function updateBallot(
  ballotID: string,
  running: boolean,
  question: string,
  options: VotingOption[]
): Promise<Ballot> {
  const result = await getCollection("ballot").findOneAndUpdate(
    { _id: new ObjectId(ballotID) },
    {
      $set: {
        running,
        question,
        options,
      },
    }
  );

  if (!result.ok) throw Error("Ballot could not be updated");
  return result.value;
}

async function deleteBallot(ballotID: string): Promise<void> {
  const result = await getCollection("ballot").deleteOne({
    _id: new ObjectId(ballotID),
  });

  if (result.deletedCount !== 1) throw Error("Ballot could not be deleted");
}

async function updateBallotRunning(
  ballotID: string,
  running: boolean
): Promise<void> {
  const result = await getCollection("ballot").updateOne(
    { _id: new ObjectId(ballotID) },
    {
      $set: {
        running,
      },
    }
  );

  if (!result.acknowledged) throw Error("Ballot could not be updated");
}

async function setTokenAsUsed(ballotId: string, token: string): Promise<void> {
  const result = await getCollection("ballot").updateOne(
    { _id: new ObjectId(ballotId) },
    {
      $push: {
        tokensUsed: token,
      },
    }
  );

  if (!result.acknowledged) throw Error("Token could not be set as used");
}

async function checkIfTokenIsUsed(
  ballotId: string,
  token: string
): Promise<boolean> {
  return (
    (await getCollection("ballot")
      .find({
        _id: new ObjectId(ballotId),
        tokensUsed: { $elemMatch: { $eq: token } },
      })
      .count()) > 0
  );
}

export default {
  getBallot,
  getBallots,
  getRunningBallot,
  addBallot,
  updateBallot,
  updateBallotRunning,
  deleteBallot,
  setTokenAsUsed,
  checkIfTokenIsUsed,
};
