import { transactionFactory, UserIdentity } from 'alastria-identity-lib'
import Web3 from "web3";
import { AbiItem } from 'web3-utils';
import { add0x } from './hex';

export async function createAlastriaId(web3: Web3, newActorPubKey: string, newActorIdentity: UserIdentity): Promise<any> {
    newActorPubKey = newActorPubKey.startsWith("0x") ? newActorPubKey.substr(2) : newActorPubKey // todo maybe move to antoher file
    const txCreateAlastriaID = transactionFactory.identityManager.createAlastriaIdentity(
        web3,
        newActorPubKey
    )
    return await newActorIdentity.getKnownTransaction(txCreateAlastriaID)
}

export async function prepareAlastriaId(web3: Web3, newActorAddress: string, entityIdentity: UserIdentity): Promise<any> {
    const preparedId = transactionFactory.identityManager.prepareAlastriaID(
        web3,
        add0x(newActorAddress)
    )
    return await entityIdentity.getKnownTransaction(preparedId)
}


export async function identityKeys(web3: Web3, addressAlastriaIdentityManager: string, identityKeysAbi: AbiItem, addressActor: string) {
    return await web3.eth.call({
        to: addressAlastriaIdentityManager,
        data: web3.eth.abi.encodeFunctionCall(identityKeysAbi, [add0x(addressActor)]
        )
    })
}