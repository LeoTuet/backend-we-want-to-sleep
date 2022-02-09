import TokenRepository from "../repositories/TokenRepository";


export class TokenService {

    public addToken(token: string, valid: boolean) {
        TokenRepository.addToken(token, valid)
    }

    public deleteToken(token: string) {
        TokenRepository.deleteToken(token)
    }

    public async checkIfTokenExists(token: string): Promise<boolean> {
        return (await TokenRepository.getToken(token)) != null
    }

    public async checkIfTokenValid(token: string): Promise<boolean> {
        return (await TokenRepository.getToken(token)).valid
    }
}