import TokenRepository from "../repositories/TokenRepository";
import { customAlphabet } from "nanoid";

const generateUnformattedToken = customAlphabet(
  "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  12
);

export class TokenService {
  public deleteToken = TokenRepository.deleteToken;

  public async addTokens(tokens: string[], valid: boolean, createdBy: string) {
    const createdAt = new Date();
    await TokenRepository.addTokens(
      tokens.map((token) => {
        return {
          token,
          valid,
          createdBy,
          createdAt,
        };
      })
    );
  }

  public async checkIfTokenExists(token: string): Promise<boolean> {
    return (await TokenRepository.getToken(token)) != null;
  }

  public async checkIfTokenValid(token: string): Promise<boolean> {
    return (await TokenRepository.getToken(token)).valid;
  }

  public generateTokens(count: number): string[] {
    return new Array(count)
      .fill("")
      .map(() => generateUnformattedToken())
      .map((id) => `${id.slice(0, 4)}-${id.slice(4, 8)}-${id.slice(8, 12)}`);
  }
}
