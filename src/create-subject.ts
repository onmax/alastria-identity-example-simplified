import { config, tokensFactory } from "alastria-identity-lib";
import Web3 from "web3";
import { AbiItem } from 'web3-utils';
import { IActor, IActorType, IAlastriaEvent, IAlastriaType, INodeConfig } from "./types";
import { createAlastriaId, getEntity, getKeyPair, identityKeys, prepareAlastriaId } from "./utilities";


export async function createSubject({ url, network, network_id }: INodeConfig, entity: IActor, newActor: IActor): Promise<string> {
    // TODO Add creations of the AT and AIC
    const web3 = new Web3(new Web3.providers.HttpProvider(url))
    entity.key_pair = await getKeyPair(entity.keystore_content, entity.password)
    newActor.key_pair = await getKeyPair(newActor.keystore_content, newActor.password)
    const entityIdentity = getEntity(web3, `0x${entity.address}`, entity.key_pair.private_key)
    const newActorIdentity = getEntity(web3, `0x${newActor.address}`, newActor.key_pair.private_key)
    const signedCreateTransaction = await createAlastriaId(web3, newActor.key_pair.public_key, newActorIdentity)
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
        message: `Entity connected to network ${url}`,
        source: IActorType.ENTITY
    }

    entity.key_pair = await getKeyPair(entity.keystore_content, entity.password)
    const entityIdentity = getEntity(web3, `0x${entity.address}`, entity.key_pair.private_key)
    yield {
        step: step++,
        type: IAlastriaType.KeystoreOpened,
        address: entity.address,
        keystore: entity.keystore_content,
        message: `Entity keystore opened and generated identity`,
        password: entity.password,
        source: newActor.type,
        key_pair: entity.key_pair
    }

    newActor.key_pair = await getKeyPair(newActor.keystore_content, newActor.password)
    const newActorIdentity = getEntity(web3, `0x${newActor.address}`, newActor.key_pair.private_key)
    yield {
        step: step++,
        type: IAlastriaType.KeystoreOpened,
        address: newActor.address,
        keystore: newActor.keystore_content,
        message: `New Actor keystore opened and generated identity`,
        password: newActor.password,
        source: newActor.type,
        key_pair: newActor.key_pair
    }

    const signedCreateTransaction = await createAlastriaId(web3, newActor.key_pair.public_key, newActorIdentity)
    yield {
        step: step++,
        message: `Signed create Alastria ID transaction by entity: ${signedCreateTransaction}`,
        type: IAlastriaType.CreateAlastriaIdTx,
        tx: signedCreateTransaction,
        source: IActorType.ENTITY
    }

    const signedPreparedTransaction = await prepareAlastriaId(web3, newActor.address, entityIdentity)
    yield {
        step: step++,
        message: `Signed prepare Alastria ID transaction by entity: ${signedPreparedTransaction}`,
        type: IAlastriaType.PrepareAlastriaIdTx,
        tx: signedPreparedTransaction,
        source: IActorType.ENTITY
    }

    const receiptPreparedTx = await web3.eth.sendSignedTransaction(signedPreparedTransaction)
    yield {
        step: step++,
        message: `Receipt of prepare Alastria ID transaction by entity: ${receiptPreparedTx}`,
        type: IAlastriaType.ReceiptPrepareAlastriaIdTx,
        receipt: receiptPreparedTx,
        source: IActorType.ENTITY
    }

    const receiptCreateTx = await web3.eth.sendSignedTransaction(signedCreateTransaction)
    yield {
        step: step++,
        message: `Receipt of create Alastria ID transaction: ${receiptCreateTx}`,
        type: IAlastriaType.ReceiptCreateAlastriaIdTx,
        receipt: receiptCreateTx,
        source: IActorType.ENTITY
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
        ),
        source: IActorType.ANY
    }
}