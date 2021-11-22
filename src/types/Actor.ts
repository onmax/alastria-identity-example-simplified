export interface IActor {
    address: string,
    password: string,
    type: IActorType,
    keystore_content: string,
    key_pair: {
        public_key: string,
        private_key: string,
    }
}

export enum IActorType {
    ENTITY = 'entity',
    SERVICE_PROVIDER = 'service_provider',
    SUBJECT = 'subject',
    ACTOR = 'actor',
    ANY = 'any',
}