import TokenRepository from "../repositories/TokenRepository";

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
}
