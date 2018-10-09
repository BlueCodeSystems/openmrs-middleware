
let getAllData = connection => tableName => async() => await connection.query(`SELECT * FROM ${tableName}`);

let getDataByUUID = connection => tableName => idAttribute => async(id) => await connection.execute(`SELECT * FROM ${tableName} WHERE ${idAttribute} = ? `, [id]);

let getDataByDatetimeNewerThan = connection => tableName => async(datetime) => await connection.execute(`SELECT * FROM ${tableName} WHERE date_changed > ? OR date_created > ?`, [datetime, datetime]);

let daoGenerator = callbacks => (tableName, idAttribute, connection) => (
    
    {
        getAllData: callbacks[0](connection)(tableName),

        getDataByUUID: callbacks[1](connection)(tableName)(idAttribute),

        getDataByDatetimeNewerThan: callbacks[2](connection)(tableName)

    }
)

export default daoGenerator([getAllData, getDataByUUID, getDataByDatetimeNewerThan]);