const DB_NAME = "todos"

const RETHINKDB_ADDRESS = "localhost";
const RETHINKDB_PORT = 28015;
const r = require('rethinkdbdash')({
    servers: [{
        host: RETHINKDB_ADDRESS,
        port: RETHINKDB_PORT
    }]
});

const tables = ["users", "todos"];

const startOperation = async () => {
    const dbList = await r.dbList();
    const dbExistStatus = dbList.filter((val) => val === DB_NAME).length !== 0;

    if (!dbExistStatus) await r.dbCreate(DB_NAME);
    const tableList = await r.db(DB_NAME).tableList();

    for (let index = 0; index < tables.length; index++) {
        const table = tables[index];

        const tableExistStatus = tableList.filter((val) => val === table).length !== 0;
        if (tableExistStatus) await r.db(DB_NAME).tableDrop(table);

        await r.db(DB_NAME).tableCreate(table);
        await r.db(DB_NAME).table(table).indexCreate("createDate");

        if (index + 1 === tables.length) console.log("Başarıyla tamamlanmıştır");
    };
};
startOperation();