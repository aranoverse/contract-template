const low = require('lowdb');
const path = require('path');
const FileSync = require('lowdb/adapters/FileSync');

export function cfg(network: string) {
    const p = path.resolve(__dirname, `../../config/${network}.json`)
    const db = low(new FileSync(p))
    db.defaults({}).write()
    return db
}

export function setProp(network: string, key: string, obj: any) {
    const c = cfg(network)
    console.log(`set net:${network}  ${key}: ${obj}`)
    c.set(key, obj).write()
}

export function getProp(network: string, key: string, log: boolean = false) {
    const c = cfg(network)
    const v = c.get(key).value()
    if (log) console.log(`get net:${network} ${key}: ${v}`)
    return v;
}