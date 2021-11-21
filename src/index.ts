import { readFileSync } from "fs";
import path from "path";
import { createSubject, CreateSubjectGen } from "./create-subject";
import { IActor, IActorType, INodeConfig } from "./types";

const nodeConfig: INodeConfig = {
    url: "http://34.91.211.67:22000",
    network: "quor",
    network_id: "redT"
}

const entity: IActor = {
    address: "a9728125c573924b2b1ad6a8a8cd9bf6858ced49",
    password: "Passw0rd",
    keystore_content: readFileSync(path.resolve('./keystores', `entity1-a9728125c573924b2b1ad6a8a8cd9bf6858ced49.json`)).toString(),
    key_pair: {
        private_key: "",
        public_key: ""
    },
    type: IActorType.ENTITY
}

const newActor: IActor = {
    address: "806bc0d7a47b890383a831634bcb92dd4030b092",
    password: "Passw0rd",
    keystore_content: readFileSync(path.resolve('./keystores', `subject1-806bc0d7a47b890383a831634bcb92dd4030b092.json`)).toString(),
    key_pair: {
        private_key: "",
        public_key: ""
    },
    type: IActorType.ACTOR,
}


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