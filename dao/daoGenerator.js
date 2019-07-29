
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

let getProviderByUser = connection => async(userUuid) => await connection.execute(`SELECT users.user_id, provider.provider_id, provider.uuid AS provider_uuid FROM provider JOIN users ON users.person_id = provider.person_id WHERE users.uuid = ?`,[userUuid])

let getLocationByUuid = connection => async(uuid) => await connection.execute(`SELECT * FROM location WHERE uuid IN (${parseArrayToInQueryString(uuid)}) AND retired = 0`)

let getProviderAttributeByAttributeTypeUuid = connection => providerId => async(attributeTypeUuid) => await connection.execute(`SELECT value_reference AS value FROM provider_attribute WHERE provider_id = ? AND attribute_type_id =(SELECT provider_attribute_type_id FROM provider_attribute_type WHERE uuid = ?) AND voided = 0`,[providerId, attributeTypeUuid])

let daoGenerator = callbacks => (tableName, uuidAttribute, datetimeAttribute, connection) => (
    
    {
        getAllData: callbacks[0](connection)(tableName),

        getDataByUUID: callbacks[1](connection)(tableName)(uuidAttribute),

        getDataByDatetimeNewerThan: callbacks[2](connection)(tableName)(datetimeAttribute)

    }
)

let dao =  {
    daoGenerator:daoGenerator([getAllData, getDataByUUID, getDataByDatetimeNewerThan]),
    getProviderByUser,
    getLocationByUuid,
    getProviderAttributeByAttributeTypeUuid,
}

let parseArrayToInQueryString = elements=> {
        
     if(elements.length > 1){
        let string = ""
        for(let element of elements){

                if(elements.indexOf(element) === elements.length-1)
                    string+=`'${element}'`
                else
                    string+=`'${element}',`
       }
	return string
     }
     else if(elements.length === 1)
        return `'${elements[0]}'`
     else
        return null
}
export default dao;
