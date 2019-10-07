import Kafka from "../config/kafka";
import config from "../config/config";
import axios from "axios";
import base64 from "base-64";


const restApiRoute = `${config.openmrsUrl}${config.openmrsRestApiRoute}` 
const credentials = 'Basic '+base64.encode(`${config.openmrsAdminUsername}:${config.openmrsAdminPassword}`)

function start(){

    registerConsumer(Kafka)("cool-client")("patient")(createOpenmrsPatient)
    registerConsumer(Kafka)("cooler-client")("visit")(createOpenmrsVisit)
  
}

const registerConsumer= kafka => groupId => topic => async(callback) => {

    const consumer = kafka.consumer({groupId})
    await consumer.connect()
    await consumer.subscribe({topic})
    await consumer.run(
        {
          eachMessage: async ({message}) => {
              consumer.pause([{ topic }])
              callback(message.value)
              consumer.resume([{ topic }])
          }
        }
    )

}

let createOpenmrsPatient = async (data) => {
    
    try{
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
  }catch(e){

  } 
}

let createOpenmrsVisit = async (data) => {
  try{
      const visitData = JSON.parse(data.toString('utf8'))
      let {patient,startDatetime,stopDatetime,visitType,location,encounters} = visitData.entity
      let createVisitResponse = await axios.post(restApiRoute+"/visit/",{patient,startDatetime,stopDatetime,visitType,location},{headers: {'Authorization':credentials}})
      let visit = createVisitResponse.data.uuid
      let submitEncounter = async (encounter) =>{
      
        if(encounter != null){ 	
          let {encounterDatetime,encounterType,location,obs} = encounter
          await axios.post(restApiRoute+"/encounter/",{encounterDatetime,patient,encounterType,location,visit,obs},{headers: {'Authorization':credentials}})
        }
      }
    
      encounters.map(submitEncounter) 
  }catch(e){
    console.log("Err")
  }
}

export default {start}
