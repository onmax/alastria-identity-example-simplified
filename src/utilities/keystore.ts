const keythereum = require("keythereum")

export function getPrivateKey(ksPath: string, password: string) {
    try {
        const ks = keythereum.recover(
            password,
            require(ksPath)
        )
        return ks.toString("hex")
    } catch (error) {
        console.log('ERROR opening keystore: ', error)
        process.exit(1)
    }
}