import { ObjectId } from "mongodb";

export interface Vote {
  _id: string;
  ballotID: ObjectId;
  vote: string;
  votedAt: Date;
}

export interface Ballot {
  _id: string;
  createdBy: string;
  running: boolean;
  question: string;
  options: VotingOption[];
  tokensUsed: string[];
}

export interface Token {
  _id: string;
  token: string;
  valid: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface VotingOption {
  identifier: string;
  label: string;
}

export interface Admin {
  _id: string;
  username: string;
  passwordHash: string;
}

export interface ApiKey {
  _id: string;
  name: string;
  keyHash: string;
  createdBy: string;
  createdAt: Date;
}
