import connection from "./dbConnection";

let con = connection.promise();

let getAllLocations =  connection => async() => await connection.query("SELECT * FROM location");

let getLocationById =  connection => async(id) => await connection.execute('SELECT * FROM `location` WHERE `location_id` = ? ', [id]);

let getLocationDatetimeNewerThan =  connection => async(datetime) => await connection.execute('SELECT * FROM `location` WHERE `date_changed` > ? OR `date_created` > ?', [datetime, datetime]);

let locationDAO = {

    getAllLocations : getAllLocations(con),
    getLocationById : getLocationById(con),
    getLocationDatetimeNewerThan : getLocationDatetimeNewerThan(con)
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function apiGen(tableName, idAttribute, connection){
   

    let getAllResource =  connection => async() => await connection.query(`SELECT * FROM ${tableName}`);

    let getResourceById =  connection => async(id) => await connection.execute(`SELECT * FROM ${tableName} WHERE ${idAttribute} = ? `, [id]);

    let getResourceDatetimeNewerThan =  connection => async(datetime) => await connection.execute(`SELECT * FROM ${tableName} WHERE 'date_changed' > ? OR 'date_created' > ?`, [datetime, datetime]);

    let capitalizeTableNameFirstLetter = capitalizeFirstLetter(tableName)

    let dao = {}

        dao[`getAll${capitalizeTableNameFirstLetter}s`] = getAllResource(connection);

        dao[`get${capitalizeTableNameFirstLetter}ById`] = getResourceById(connection);

        dao[`get${capitalizeTableNameFirstLetter}DatetimeNewerThan`] = getResourceDatetimeNewerThan(connection);

    return dao;
}

export default apiGen('location','location_id',con);