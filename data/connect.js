const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

class DB {
    static database = undefined
    static connect() {
        open({
            filename: './data/test.db',
            driver: sqlite3.Database,
            mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE | sqlite3.OPEN_SERIALIZED,
        }).then((db) => {
            // do your thing
            this.database = db
            console.log("database ok");
        })
    }
}

module.exports = DB