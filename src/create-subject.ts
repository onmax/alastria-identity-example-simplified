import { config, tokensFactory } from "alastria-identity-lib";
import Web3 from "web3";
import { AbiItem } from 'web3-utils';
import { IActor, IAlastriaEvent, IAlastriaType, INodeConfig } from "./types";
import { createAlastriaId, getEntity, identityKeys, prepareAlastriaId } from "./utilities";


export async function createSubject({ url, network, network_id }: INodeConfig, entity: IActor, newActor: IActor): Promise<string> {
    // TODO Add creations of the AT and AIC
    const web3 = new Web3(new Web3.providers.HttpProvider(url))
    const entityIdentity = getEntity(web3, `0x${entity.address}`, entity.privateKey)
    const newActorIdentity = getEntity(web3, `0x${newActor.address}`, newActor.privateKey)
    const signedCreateTransaction = await createAlastriaId(web3, newActor.publicKey, newActorIdentity)
    const signedPreparedTransaction = await prepareAlastriaId(web3, newActor.address, entityIdentity)
    await web3.eth.sendSignedTransaction(signedPreparedTransaction)
    await web3.eth.sendSignedTransaction(signedCreateTransaction)
    const identityKeysAbi = config.contractsAbi.AlastriaIdentityManager.identityKeys as AbiItem
    const alastriaIdentity = await identityKeys(web3, config.alastriaIdentityManager, identityKeysAbi, newActor.address)

    return tokensFactory.tokens.createDID(
        network,
        alastriaIdentity.slice(26),
        network_id
    )
}

export async function* CreateSubjectGen({ url, network, network_id }: INodeConfig, entity: IActor, newActor: IActor): AsyncGenerator<IAlastriaEvent, any, any> {
    // TODO Add creations of the AT and AIC

    let step = 1;

    const web3 = new Web3(new Web3.providers.HttpProvider(url))
    yield {
        step: step++,
        type: IAlastriaType.ConnectedToNetwork,
        message: `Connected to network ${url}`,
    }

    const entityIdentity = getEntity(web3, `0x${entity.address}`, entity.privateKey)
    const newActorIdentity = getEntity(web3, `0x${newActor.address}`, newActor.privateKey)

    const signedCreateTransaction = await createAlastriaId(web3, newActor.publicKey, newActorIdentity)
    yield {
        step: step++,
        message: `Signed create Alastria ID transaction: ${signedCreateTransaction}`,
        type: IAlastriaType.CreateAlastriaIdTx,
        tx: signedCreateTransaction,
    }

    const signedPreparedTransaction = await prepareAlastriaId(web3, newActor.address, entityIdentity)
    yield {
        step: step++,
        message: `Signed prepare Alastria ID transaction: ${signedPreparedTransaction}`,
        type: IAlastriaType.PrepareAlastriaIdTx,
        tx: signedPreparedTransaction,
    }

    const receiptPreparedTx = await web3.eth.sendSignedTransaction(signedPreparedTransaction)
    yield {
        step: step++,
        message: `Receipt of prepare Alastria ID transaction: ${receiptPreparedTx}`,
        type: IAlastriaType.ReceiptPrepareAlastriaIdTx,
        receipt: receiptPreparedTx
    }

    const receiptCreateTx = await web3.eth.sendSignedTransaction(signedCreateTransaction)
    yield {
        step: step++,
        message: `Receipt of create Alastria ID transaction: ${receiptCreateTx}`,
        type: IAlastriaType.ReceiptCreateAlastriaIdTx,
        receipt: receiptCreateTx,
    }


    const identityKeysAbi = config.contractsAbi.AlastriaIdentityManager.identityKeys as AbiItem
    const alastriaIdentity = await identityKeys(web3, config.alastriaIdentityManager, identityKeysAbi, newActor.address)
    yield {
        step: step++,
        message: `Obtained the proxy address of the new actor in the network: ${alastriaIdentity.slice(26)}`,
        type: IAlastriaType.GetIdentityKeys,
        address: `0x${newActor.address}`,
        alastria_identity: alastriaIdentity.slice(26),
        did: tokensFactory.tokens.createDID(
            network,
            alastriaIdentity.slice(26),
            network_id
        )
    }
}