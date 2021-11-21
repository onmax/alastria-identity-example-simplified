import Wallet from 'ethereumjs-wallet'
import { IActor } from '../types'
import { remove0x } from './hex';


export async function getKeyPair(ks: string, password: string): Promise<IActor["key_pair"]> {
    try {
        const wallet = await Wallet.fromV3(ks, password)
        return {
            private_key: remove0x(wallet.getPrivateKeyString()),
            public_key: remove0x(wallet.getPublicKeyString())
        }
    } catch (error) {
        console.log('ERROR opening keystore: ', error)
        process.exit(1)
    }
}