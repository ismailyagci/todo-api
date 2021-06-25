const RETHINKDB_ADDRESS = "localhost";
const RETHINKDB_PORT = 28015;
export const r = require('rethinkdbdash')({
    servers: [{
        host: RETHINKDB_ADDRESS,
        port: RETHINKDB_PORT
    }]
});

//192.168.174.2