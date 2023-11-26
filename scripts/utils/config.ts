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
    console.log(`set net:${network} k:${key} v:${obj}`)
    c.set(key, obj).write()
}