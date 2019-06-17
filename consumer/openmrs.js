import Kafka from "../config/kafka";
import config from "../config/config";
import axios from "axios";
import base64 from "base-64";


function start(){

    registerConsumer(Kafka)("cool-client")("patient")(createOpenmrsPatient)
    
}

const registerConsumer= kafka => groupId => topic => async(callback) => {

    const consumer = kafka.consumer({groupId})
    await consumer.connect()
    await consumer.subscribe({topic})
    await consumer.run(
        {
          eachMessage: async ({message}) => {
              callback(message.value)
          }
        }
    )

}

let createOpenmrsPatient = async (data) => {
    
    const restApiRoute = `${config.openmrsUrl}${config.openmrsRestApiRoute}` 
    const credentials = 'Basic '+base64.encode(`${config.openmrsAdminUsername}:${config.openmrsAdminPassword}`)
    const patientData = JSON.parse(data.toString('utf8'))
    let {address1,attributes,birthdate,cityVillage,familyName,gender,givenName,identifiers,stateProvince} = patientData.entity

    let normalizeIdentifiers = id => {
      
      id.preferred = (id.preferred == 1)?true:false
      return id
    }

    //Normalize data
    birthdate = birthdate.substring(0, 10)
    identifiers = identifiers.map(normalizeIdentifiers)

    //Create patient in Openmrs
    let createPersonResponse = await axios.post(restApiRoute+"/person/",{gender,birthdate, names:[{givenName,familyName}]},{headers: {'Authorization':credentials}})
    let person = createPersonResponse.data.uuid
    await axios.post(restApiRoute+"/patient/",{person,identifiers},{headers: {'Authorization':credentials}})
    await axios.post(`${restApiRoute}/person/${person}/address/`,{address1, cityVillage,stateProvince},{headers: {'Authorization':credentials}})    
}

export default {start}
