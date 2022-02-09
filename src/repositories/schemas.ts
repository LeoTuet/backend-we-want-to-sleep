import { ObjectId } from "mongodb";

export interface Vote {
  _id: string;
  token: string;
  ballotID: ObjectId;
  vote: string;
  votedAt: Date;
}

export interface Ballot {
  _id: string;
  running: boolean;
  options: VotingOption[];
}

export interface Token {
  _id: string;
  token: string;
  valid: boolean;
  createdAt: Date;
}

export interface VotingOption {
  identifier: string;
  label: string;
}
