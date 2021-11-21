import { UserIdentity } from 'alastria-identity-lib'

export function getEntity(web3: any, address: `0x${string}`, privateKey: string): UserIdentity {
    return new UserIdentity(web3, address, privateKey, 0)
}