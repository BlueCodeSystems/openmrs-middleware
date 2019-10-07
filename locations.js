import axios from "axios";
import base64 from "base-64";

import dbConnection from './resources/dbConnection';

const connection = dbConnection.promise()
const credentials = 'Basic '+base64.encode(`admin:pass`)
const credentialsOpenmrs = 'Basic '+base64.encode(`admin:pass`)

let url = "http://localhost:8090/api/organisationUnits"
let openmrsLocationRestRes = 'http://localhost:8080/openmrs/ws/rest/v1/location/'

let dhisOuId = "29c6fa1c-65d4-4e69-8411-7d99be2f1dfb"

//Map openmrs location tags to DHIS location hierachy levels
let openmrsTags = new Map()
openmrsTags.set(2,"4bd0baf0-40eb-4209-bc6b-1080f3b34b41")
openmrsTags.set(3,"332f8bdb-7a2d-4063-9c76-cbb4a969fb8d")
openmrsTags.set(4,"f2529ee6-9011-4432-b045-6a4ce0a78b66")
openmrsTags.set(5,"a4ed82df-e43c-4920-a24f-dce2dedfd4fc")
openmrsTags.set(6,"45749753-224e-4672-9e99-f2024cd51823")
openmrsTags.set(7,"2a437d2b-9468-4422-9b23-ab74db3e1d09")

let getLocation = async() => {

    let locations = await axios.get(url,{headers: {'Authorization':credentials}})

    let pageCount = locations.data.pager.pageCount
  
    let page = 38;

    let attribute = 'location_attribute_type_id'

    const attributeTypeId = (await connection.query(`SELECT ${attribute} FROM location_attribute_type WHERE uuid = '${dhisOuId}'`))[0][0][attribute]



   //get locations from dhis2 from to openmrs
   for(page; page <= pageCount;page++){

        let dhisLocationsRequest = await axios.get(`${url}?page=${page}`,{headers: {'Authorization':credentials}})

        let displayNames = new Set()

        let locations = dhisLocationsRequest.data.organisationUnits

        
        for(let location of locations){

            let exists = (await connection.execute(`select value_reference as dhis_ou_id from location join location_attribute on location.location_id = location_attribute.location_id where attribute_type_id = ${attributeTypeId} having dhis_ou_id = '${location.id}'`))[0][0]

            let openmrsLocation = {name:location.displayName.substring(3), attributes:[{attributeType:dhisOuId, value:location.id}]}
        
            if(!exists){

                if(!displayNames.has(location.displayName)){
                    
                    try {
                        await axios.post(openmrsLocationRestRes, openmrsLocation ,{headers: {'Authorization':credentialsOpenmrs}})
                        console.log("Location created")
                        displayNames.add(location.displayName)
                    } catch (error) {
                        console.error("Err", error)
                        continue
                    }  
                }
            }
            else{
                console.log("Location already exits")
            }


        }

        console.log(`${page} of ${pageCount}`)
   }
   
   //Map location hierachy and tags
   let dhisOuIds = (await connection.execute(`select value_reference as dhis_ou_id, location.uuid from location join location_attribute on location.location_id = location_attribute.location_id where attribute_type_id = ${attributeTypeId}`))[0]


   for(let dhisOuId of dhisOuIds){
        try{
            let dhisLocationsRequest = await axios.get(`${url}/${dhisOuId['dhis_ou_id']}`,{headers: {'Authorization':credentials}})

            let parentTag = openmrsTags.get(dhisLocationsRequest.data.level)

            let childrenTag = openmrsTags.get(dhisLocationsRequest.data.level + 1)

            let children = dhisLocationsRequest.data.children.map(child => child.id)

            let paramChild = ""

            for(let child of children){

                children.length

                if(children.indexOf(child) === children.length-1)
                    paramChild+=`'${child}'`
                else
                    paramChild+=`'${child}',`
            }

            let parentLocation = dhisOuId['uuid']

            let childLocations = (await connection.execute(`select location.uuid from location join location_attribute on location.location_id = location_attribute.location_id where attribute_type_id = ${attributeTypeId} and value_reference in (${paramChild})`))[0].map(location=> location.uuid)

            let createParentLocationRequest = await axios.post(`${openmrsLocationRestRes}${parentLocation}/`, {tags:[parentTag]} ,{headers: {'Authorization':credentialsOpenmrs}})
            console.log("parent location updated",child)
            for(let child of childLocations){

                let createChildLocationRequest = await axios.post(`${openmrsLocationRestRes}${child}/`, {tags:[childrenTag], parentLocation} ,{headers: {'Authorization':credentialsOpenmrs}})

                console.log("child location updated",child)
            }

        }catch(error){
            continue
        }
   }

}

getLocation()