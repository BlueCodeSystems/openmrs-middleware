
let getAllData = connection => tableName => async() => await connection.query(`SELECT * FROM ${tableName}`);

let getDataByUUID = connection => tableName => uuidAttribute => async(uuid) => await connection.execute(`SELECT * FROM ${tableName} WHERE ${uuidAttribute} = ? `, [uuid]);

let getDataByDatetimeNewerThan = connection => tableName => datetimeAttribute => async(datetime) => {

    let datetimeArg = []; 
    let condition = datetimeAttribute.reduce((statement, attribute, index)=> {

            datetimeArg.push(datetime)

            if(datetimeAttribute.length - index == 1)
                return `${statement} ${attribute} > ?` 
            else
                return `${statement} ${attribute} > ? OR`
        },"");

    return await connection.execute(`SELECT * FROM ${tableName} WHERE ${condition}`, datetimeArg);
}

let daoGenerator = callbacks => (tableName, uuidAttribute, datetimeAttribute, connection) => (
    
    {
        getAllData: callbacks[0](connection)(tableName),

        getDataByUUID: callbacks[1](connection)(tableName)(uuidAttribute),

        getDataByDatetimeNewerThan: callbacks[2](connection)(tableName)(datetimeAttribute)

    }
)

export default daoGenerator([getAllData, getDataByUUID, getDataByDatetimeNewerThan]);