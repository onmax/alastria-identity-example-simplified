import { tokensFactory } from 'alastria-identity-lib';

const configData = {
    didEntity1: "did:ala:quor:redT:4b83432035d1477d3a99b23baa82bd9db61a2d68",
    providerURL: "https://regular.telsius.blockchainbyeveris.io:2000",
    callbackURL: "https://serviceprovider.alastria.blockchainbyeveris.io/api/login/",
    networkId: "Alastria network",
    tokenExpTime: 1563783392,
    kidCredential: "did:ala:quor:redt:12eeaCCA9eEbB78eB97d7cac6b#keys-1",
    entity1Pubk: "0x356e3fce435d8729062e52d263c0c705b3c5e201a9a9608cdb070764e6b8df30ae8423b439a7af2bcc3529778341ab06c1e44411352f217b68ce44a673a1df63",
    tokenActivationDate: 1563783392,
    jsonTokenId: "ze298y42sba"
}
export function crtAIC(privateKey: string, context: string[], type: string[], createAlastriaTX: string, alastriaToken: string, publicKey: string, kid?: string, jwk?: string, jti?: string, iat?: number, exp?: number, nbf?: number) {
    const jwt = tokensFactory.tokens.createAIC(context, type, createAlastriaTX, alastriaToken, publicKey, kid, jwk, jti, iat, exp, nbf);
    return tokensFactory.tokens.signJWT(jwt, privateKey);
}

export function createSignedAT(entity1PrivateKey: any): string {
    const at = tokensFactory.tokens.createAlastriaToken(
        configData.didEntity1,
        configData.providerURL,
        configData.callbackURL,
        configData.networkId,
        configData.tokenExpTime,
        configData.kidCredential,
        configData.entity1Pubk,
        configData.tokenActivationDate,
        configData.jsonTokenId
    )
    const signedAT = tokensFactory.tokens.signJWT(at, entity1PrivateKey)
    return signedAT;
}