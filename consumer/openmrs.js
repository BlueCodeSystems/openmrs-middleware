import Kafka from "../config/kafka";
import config from "../config/config";
import axios from "axios";
import base64 from "base-64";
import moment from "moment";


const restApiRoute = `${config.openmrsUrl}${config.openmrsRestApiRoute}` 
const credentials = 'Basic '+base64.encode(`${config.openmrsAdminUsername}:${config.openmrsAdminPassword}`)

function start(){

    registerConsumer(Kafka)(config.kafkaPatientTopicConsumerGroupID)("patient")(createOpenmrsPatient)
    registerConsumer(Kafka)(config.kafkaVisitTopicConsumerGroupID)("visit")(createOpenmrsVisit)
  
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

let normalizeIdentifiers = id => {
          
  id.preferred = (id.preferred == 1)?true:false
  return id
}

let createOpenmrsPatient = async (data) => {
   
    try{

        const patientData = JSON.parse(data.toString('utf8'))
        console.log("patient consumer", patientData)
        let {birthdate,familyName,gender,givenName,identifiers,uuid,address1,cityVillage,stateProvince} = patientData.entity

        if(uuid == undefined){
          
          //Normalize data
          birthdate = moment(birthdate).format("YYYY-MM-DD")
          identifiers = identifiers.map(normalizeIdentifiers)

          //Create patient in Openmrs
          let createPersonResponse = await axios.post(restApiRoute+"person/",{gender,birthdate, names:[{givenName,familyName}]},{headers: {'Authorization':credentials}})
          let person = createPersonResponse.data.uuid
          await axios.post(restApiRoute+"patient/",{person,identifiers},{headers: {'Authorization':credentials}})

          updatePatient({address1,cityVillage,stateProvince,uuid:person})
        }else
          updatePatient(patientData.entity)

  }catch(e){
      console.log("patient creating error:",e)
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
          let {encounterDatetime,encounterType,location,obs,provider} = encounter

          console.log("provider:",provider)
          let response = await axios.post(restApiRoute+"/encounter/",{encounterDatetime,patient,encounterType,location,visit,obs},{headers: {'Authorization':credentials}})
          encounter = response.data.uuid
          console.log("encounter:",encounter)
          let encounterRole = "240b26f9-dd88-4172-823d-4a8bfeb7841f"
          await axios.post(`${restApiRoute}encounter/${encounter}/encounterprovider/`,{provider,encounter,encounterRole},{headers: {'Authorization':credentials}})
        }
      }
    
      encounters.map(submitEncounter) 
  }catch(e){
    console.log("visit creating error", e)
  }
}
async function updatePatient({address1,attributes,birthdate,cityVillage,familyName,gender,givenName,identifiers,stateProvince,uuid,voided}){
  try{

      let personUuid = uuid;
      //Update name
      if(familyName != undefined || givenName != undefined){
          
          let name = {}
          
          if(familyName != undefined)
            name = {...name,familyName}

          if(givenName != undefined)
            name = {...name, givenName}

          let response = await axios.post(`${restApiRoute}person/${personUuid}/name/`,name,{headers: {'Authorization':credentials}})
          let preferredName = response.data.uuid
          await axios.post(`${restApiRoute}person/${personUuid}/`,{preferredName},{headers: {'Authorization':credentials}})
      }
 
      //Update ID
      if(identifiers !== undefined && identifiers.length > 0){
          
          identifiers = identifiers.map(normalizeIdentifiers)

          let response = await axios.get(`${restApiRoute}patient/${personUuid}/identifier/`,{headers: {'Authorization':credentials}})

          let remoteIdMetadata = response.data.results.map(id => ({identifierType:id.identifierType.uuid, uuid:id.uuid}))
          identifiers =  identifiers.flatMap(getAttributeMetadata(remoteIdMetadata,'identifierType','identifier'))

          for await(let {identifier, identifierType,uuid} of identifiers){
            
            if(uuid !== undefined)
              if(voided != undefined && voided == 1)//delete
                await axios.delete(`${restApiRoute}patient/${personUuid}/identifier/${uuid}?!purge`,{headers: {'Authorization':credentials}})
              else //update
                await axios.post(`${restApiRoute}patient/${personUuid}/identifier/${uuid}/`,{identifier,identifierType},{headers: {'Authorization':credentials}})
            else
              await axios.post(`${restApiRoute}patient/${personUuid}/identifier/`,{identifier,identifierType},{headers: {'Authorization':credentials}})
          }
      }

      //Update attributes
      if(attributes !== undefined && attributes.length > 0){

          let response = await axios.get(`${restApiRoute}person/${personUuid}/attribute/`,{headers: {'Authorization':credentials}})

          let attributeMetadata = response.data.results.map(attr => ({attributeType:attr.attributeType.uuid, uuid:attr.uuid}))
          attributes = attributes.flatMap(getAttributeMetadata(attributeMetadata,'attributeType','value'))

          console.log("Got to attrbutes", attributes)
        for await(let {attributeType, uuid, value} of attributes){

          if(uuid !== undefined)
            await axios.post(`${restApiRoute}person/${personUuid}/attribute/${uuid}`,{attributeType,value},{headers: {'Authorization':credentials}})
          else
            await axios.post(`${restApiRoute}person/${personUuid}/attribute/`,{attributeType,value},{headers: {'Authorization':credentials}})
        }
    }

    //Update address
    if(address1 != undefined || cityVillage != undefined || stateProvince != undefined){
     
      let address = {preferred:true}
          
      if(address1 != undefined)
        address = {...address,address1}

      if(cityVillage != undefined)
        address = {...address, cityVillage}
      
        if(stateProvince != undefined)
        address = {...address, stateProvince}

        console.log("address",address)

        let response = await axios.get(`${restApiRoute}/person/${personUuid}/address/`,{headers: {'Authorization':credentials}})
        
        let initialAddress = response.data.results

        if(initialAddress.length > 0){

          let uuid = initialAddress.filter(address => address.preferred == true)[0].uuid

          console.log('Address uuid', uuid)
          await axios.post(`${restApiRoute}/person/${personUuid}/address/${uuid}`,address,{headers: {'Authorization':credentials}})

        }else
          await axios.post(`${restApiRoute}/person/${personUuid}/address/`,{address1, cityVillage,stateProvince},{headers: {'Authorization':credentials}})
        
    }

    //Update date of birth
    if(birthdate != undefined && gender != undefined){

      birthdate = moment(birthdate).format("YYYY-MM-DD")
      await axios.post(`${restApiRoute}/person/${personUuid}/`,{birthdate,gender},{headers: {'Authorization':credentials}}) 
    }

    //Delete a patient
    if(identifiers == undefined && voided !== undefined && voided == 1){
        await axios.delete(`${restApiRoute}/person/${personUuid}?!purge`,{headers: {'Authorization':credentials}})
    }

  }catch(e){
    console.log("patient updating error",e)
  }
}

let getAttributeMetadata = (metadata,valueIndexType,valueIndexName) => attribute => {
      
  let remoteAttributes = metadata
      .filter(mdata => mdata[valueIndexType] == attribute[valueIndexType])
      .map(mdata => { 
         let remoteAttribute = {...mdata}
         remoteAttribute[valueIndexName] = attribute[valueIndexName]
         return remoteAttribute
        })

  if(remoteAttributes.length > 0){                           
    return remoteAttributes
  }else{
    return attribute
  }                                       
}

export default {start}
