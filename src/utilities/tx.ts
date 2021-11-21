import { transactionFactory, UserIdentity } from 'alastria-identity-lib'
const { createAlastriaIdentity, prepareAlastriaID } = transactionFactory.identityManager
import Web3 from "web3";
import { AbiItem } from 'web3-utils';
import { add0x, remove0x } from './hex';

export async function createAlastriaId(web3: Web3, newActorPubKey: string, newActorIdentity: UserIdentity): Promise<any> {
    const txCreateAlastriaID = createAlastriaIdentity(web3, remove0x(newActorPubKey))
    return await newActorIdentity.getKnownTransaction(txCreateAlastriaID)
}

export async function prepareAlastriaId(web3: Web3, newActorAddress: string, entityIdentity: UserIdentity): Promise<any> {
    const preparedId = prepareAlastriaID(web3, add0x(newActorAddress))
    return await entityIdentity.getKnownTransaction(preparedId)
}


export async function identityKeys(web3: Web3, addressAlastriaIdentityManager: string, identityKeysAbi: AbiItem, addressActor: string) {
    return await web3.eth.call({
        to: addressAlastriaIdentityManager,
        data: web3.eth.abi.encodeFunctionCall(identityKeysAbi, [add0x(addressActor)]
        )
    })
}