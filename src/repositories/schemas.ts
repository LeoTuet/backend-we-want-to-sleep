export interface Vote {
  _id: string;
  ballotID: string;
  vote: string;
  votedAt: Date;
}

/** A object with keys as language identifier and values as text in the corresponding language */
export type TranslatableText = Record<string, string>;

export interface Ballot {
  _id: string;
  createdBy: string;
  running: boolean;
  question: TranslatableText;
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
  label: TranslatableText;
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
