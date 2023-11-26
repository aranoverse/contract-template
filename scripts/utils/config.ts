const low = require('lowdb');
const path = require('path');
const FileSync = require('lowdb/adapters/FileSync');

export function cfg(network: string) {
    const p = path.resolve(__dirname, `../../config/${network}.json`)
    const db = low(new FileSync(p))
    db.defaults({}).write()
    return db
}
