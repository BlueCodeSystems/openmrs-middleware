
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

let getProviderByUser = connection => async(userUuid) => await connection.execute(`SELECT users.user_id, provider.* FROM provider JOIN users ON users.person_id = provider.person_id WHERE users.uuid = ?`,[userUuid])

let getLocationByUuid = connection => async(uuid) => await connection.execute(`SELECT * FROM location WHERE uuid IN (${parseArrayToInQueryString(uuid)}) AND retired = 0`)

let getPersonNameByProviderId = connection => async(providerId) => await connection.execute(`SELECT person_name.* FROM person_name JOIN provider ON person_name.person_id = provider.person_id WHERE provider_id = ? AND person_name.voided = 0`,[providerId])

let getProviderAttributeByAttributeTypeUuid = connection => providerId => async(attributeTypeUuid) => await connection.execute(`SELECT value_reference AS value FROM provider_attribute WHERE provider_id = ? AND attribute_type_id =(SELECT provider_attribute_type_id FROM provider_attribute_type WHERE uuid = ?) AND voided = 0`,[providerId, attributeTypeUuid])


//Facility DOA

let getData = connection => (tableName, patientIdAttribute='patient_id') => locationId => limit => async(datetime, offset) => {
    
    if(['identifier','visit','encounter'].includes(tableName))
        return await connection.query(`SELECT * FROM ${tableName} WHERE location_id = ? AND (date_created > ? OR date_changed > ?) LIMIT ?,?`,[locationId, datetime, datetime,offset,limit])
    else if(['person','person_name','person_address'].includes(tableName))
        return await connection.query(`SELECT DISTINCT ${patientIdAttribute}, ${tableName}.* FROM ${tableName} JOIN patient_identifier ON ${tableName}.${patientIdAttribute} = patient_identifier.patient_id WHERE patient_identifier.location_id = ? AND (${tableName}.date_created > ?  OR ${tableName}.date_changed > ?) LIMIT ?,?`,[locationId, datetime, datetime, offset,limit])
    else if(['patient'].includes(tableName))
        return await connection.query(`SELECT DISTINCT ${tableName}.patient_id, ${tableName}.* FROM ${tableName} JOIN patient_identifier ON ${tableName}.${patientIdAttribute} = patient_identifier.patient_id WHERE patient_identifier.location_id = ? AND (${tableName}.date_created > ?  OR ${tableName}.date_changed > ?) LIMIT ?,?`,[locationId, datetime, datetime, offset,limit])
    else if(['patient_identifier'].includes(tableName))
        return await connection.query(`SELECT * FROM ${tableName} WHERE location_id = ? AND (date_created > ?  OR date_changed > ?) LIMIT ?,?`,[locationId, datetime, datetime, offset,limit])
    else if(['obs'].includes(tableName))
        return await connection.query(`SELECT * FROM ${tableName} WHERE location_id = ? AND date_created > ? LIMIT ?,?`,[locationId, datetime,offset,limit])
    else if(['location','concept','concept_name','location_tag','location_attribute','location_attribute_type'].includes(tableName))
        return await connection.query(`SELECT * FROM ${tableName} WHERE (date_created > ? OR date_changed > ?) LIMIT ?,?`,[datetime,datetime,offset,limit])
    else if(['concept_answer'].includes(tableName))
        return await connection.query(`SELECT * FROM ${tableName} WHERE date_created > ? LIMIT ?,?`,[datetime,offset,limit])

}

//patient
let getPatient = connection => locationId => (limit) => async(datetime) => await connection.query(`SELECT patient.* FROM patient JOIN patient_identifier ON patient.patient_id = patient_identifier.patient_id WHERE patient_identifier.location_id = ? AND (patient.date_created > ?  OR patient.date_changed > ?) LIMIT ?`,[locationId, datetime, datetime, limit]);



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
    getData,getPatient, getPersonNameByProviderId
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
