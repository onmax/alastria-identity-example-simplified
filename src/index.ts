import path from "path";
import { createSubject, CreateSubjectGen } from "./create-subject";
import { IActor, INodeConfig } from "./types";
import { getPrivateKey } from "./utilities";

const nodeConfig: INodeConfig = {
    url: "http://34.91.211.67:22000",
    network: "quor",
    network_id: "redT"
}

const entity: IActor = {
    address: "a9728125c573924b2b1ad6a8a8cd9bf6858ced49",
    password: "Passw0rd",
    publicKey: "0x356e3fce435d8729062e52d263c0c705b3c5e201a9a9608cdb070764e6b8df30ae8423b439a7af2bcc3529778341ab06c1e44411352f217b68ce44a673a1df63",
    privateKey: "",
}

const newActor: IActor = {
    address: "806bc0d7a47b890383a831634bcb92dd4030b092",
    password: "Passw0rd",
    publicKey: "0x2e507af01167c98a6accc0cd46ab2a256dd6b6c69ec1c0c28f80fb62e1f7d70233768b0c58dbbdac1fc358b8141c075a520483cf9779e4ea98d13df2833f3767",
    privateKey: "",
}

// TODO move to generator
entity.privateKey = getPrivateKey(path.resolve('./keystores', `entity1-${entity.address}.json`), entity.password)
newActor.privateKey = getPrivateKey(path.resolve('./keystores', `subject1-${newActor.address}.json`), newActor.password)


async function runGenerator() {
    const did1 = await createSubject(nodeConfig, entity, newActor);
    console.log(did1);

    const generator = CreateSubjectGen(nodeConfig, entity, newActor)
    let result = await generator.next();
    while (!result.done) {
        console.log(result.value);
        result = await generator.next();
    }
}

runGenerator()