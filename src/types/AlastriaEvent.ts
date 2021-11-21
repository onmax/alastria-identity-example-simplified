
import { TransactionReceipt } from 'web3-core';
export enum IAlastriaType {
    ConnectedToNetwork = "ConnectedToNetwork",
    CreateAlastriaIdTx = "CreateAlastriaIdTx",
    ReceiptCreateAlastriaIdTx = "ReceiptCreateAlastriaIdTx",
    PrepareAlastriaIdTx = "PrepareAlastriaIdTx",
    ReceiptPrepareAlastriaIdTx = "ReceiptPrepareAlastriaIdTx",
    GetIdentityKeys = "GetIdentityKeys",
}
export type IAlastriaEvent = IConnectedToNetworkEvent | ITxCreateAlastriaIdEvent | IReceiptTxCreateAlastriaIdEvent | ITxPrepareAlastriaIdEvent | IReceiptTxPrepareAlastriaIdEvent | IReceiptTxPrepareAlastriaIdEvent | IGetIdentityKeysEvent

interface IBaseAlastriaEvent {
    step: number
    message: string
}

interface ITxAlastriaEvent {
    tx: string
}

interface IConnectedToNetworkEvent extends IBaseAlastriaEvent {
    type: IAlastriaType.ConnectedToNetwork
}


interface IReceiptTxAlastriaEvent {
    receipt: TransactionReceipt
}

export interface ITxCreateAlastriaIdEvent extends IBaseAlastriaEvent, ITxAlastriaEvent {
    type: IAlastriaType.CreateAlastriaIdTx
}

export interface IReceiptTxCreateAlastriaIdEvent extends IBaseAlastriaEvent, IReceiptTxAlastriaEvent {
    type: IAlastriaType.ReceiptCreateAlastriaIdTx
}

export interface ITxPrepareAlastriaIdEvent extends IBaseAlastriaEvent, ITxAlastriaEvent {
    type: IAlastriaType.PrepareAlastriaIdTx
}

export interface IReceiptTxPrepareAlastriaIdEvent extends IBaseAlastriaEvent, IReceiptTxAlastriaEvent {
    type: IAlastriaType.ReceiptPrepareAlastriaIdTx
}

export interface IGetIdentityKeysEvent extends IBaseAlastriaEvent {
    type: IAlastriaType.GetIdentityKeys,
    alastria_identity: string,
    address: string,
    did: string
}