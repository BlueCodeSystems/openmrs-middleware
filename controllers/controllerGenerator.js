import moment from "moment";
import axios from "axios";
import {Kafka} from "kafkajs";
import config from "../config/config";
import dbConnection from '../resources/dbConnection';
import dao from "../dao/daoGenerator"
import path from "path";
import fs from "fs";


const connection = dbConnection.promise();

const kafka = new Kafka({clientId:'cool-client',brokers:[config.kafkaBroker]})
const producer = kafka.producer();

let datetimeFormatter = datetime => moment(datetime).format('YYYY-MM-DD HH:mm:ss')

let getAllResoures = dao => async (req, res) => res.json((await dao.getAllData())[0]);

let getResourcesByDatetimeNewerThan = datetimeFormatter => dao => async (req, res) => {

    let datetime = datetimeFormatter(req.params['datetime']);
   
    return res.json((await dao.getDataByDatetimeNewerThan(datetime))[0]);
} 

let putResource = producer => route => async(req, res) => {

    const topic = route.split("/").join("-");

    let messages = [];
    let timestamp = moment.now(); 
    req.body.map(message => messages.push({
        value:JSON.stringify({
            entity:message,
            batchVersion:Number(req.params['batchVersion']),
            timestamp
        })
    }));

    console.log("messages", messages);

    await producer.connect();

    let response = await producer.send({topic, messages});

    await producer.disconnect();  

    res.send(response);
}

let getResourcesByUUID = dao => async (req, res) => res.json((await dao.getDataByUUID(req.params['uuid']))[0]);

let controllerGenerator = callbacks => resourceRoute => dao => (

    {
        resourceRoute : resourceRoute,

        getAllResources: callbacks[0](dao),

        getResourcesByUUID: callbacks[1](dao),

        getResourcesByDatetimeNewerThan: callbacks[2](callbacks[3])(dao),

        putResource: callbacks[4](resourceRoute)
    }
)

let getId = async(req, res) => {

   const batchSize = Number(req.params['batchSize'])
   const source = Number(req.params['source'])
   const response = await axios.get(`${config.openmrsUrl}module/idgen/exportIdentifiers.form?source=${source}&numberToGenerate=${batchSize}&username=${config.openmrsAdminUsername}&password=${config.openmrsAdminPassword}`);
  
    res.json(response.data)
}

 let getProviderData = connection => doa => async(req, res) => {

    let user = req.data.user
    user.provider = (await doa.getProviderByUser(connection)(user.uuid))[0][0]
    user.providerId = user.provider.provider_id
    user.userId = user.provider.user_id
    let attributes = ((await doa.getProviderAttributeByAttributeTypeUuid(connection)(user.providerId)('c34fac13-9c48-4f29-beb1-04c8d0a86754'))[0]).map(result => result.value)
    user.location = (await doa.getLocationByUuid(connection)(attributes))[0]
    user.personName = (await doa.getPersonNameByProviderId(connection)(user.providerId))[0][0]
    user.personId = user.personName.person_id;
    req.data.timeZone = process.env.TZ
    res.json(req.data)
 }

 function uploadFiles(req, res) {
        
    const EDI_DIR = config.ediDirectory;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400);
    }

    let name = Object.keys(req.files)[0]
    let files = req.files[name];

    const dir = `${EDI_DIR}/${name}/${moment.now().toString()}`

    fs.mkdirSync(dir, { recursive: true });

    if(Array.isArray(files))
        files.map(file => file.mv(`${dir}/${file.name}`, err => console.error(err)));
    else
        files.mv(`${dir}/${files.name}`, err => console.error(err));

    res.sendStatus(200);
 }


 let genericController = connection => dao => (tableName, patientIdAttribute='patient_id')  => async(req, res) => {
     
    const locationId = Number(req.params['locationId'])
    const limit = Number(req.params['limit'])
    const offset = Number(req.params['offset'])
    const datetime = req.params['datetime']

    const result = (await dao.getData(connection)(tableName, patientIdAttribute)(locationId)(limit)(datetime, offset))[0]

    res.json(result)
 }

let doaControllerGenerator = controllerGenerator([getAllResoures, getResourcesByUUID, getResourcesByDatetimeNewerThan, datetimeFormatter,putResource(producer)])



let controller = {
    uploadFiles,
	doaControllerGenerator,
        getId,
        getProviderData:getProviderData(connection)(dao),
        getPatientIdentifier:genericController(connection)(dao)('patient_identifier'),
        getVisit:genericController(connection)(dao)('visit'),
        getEncounter:genericController(connection)(dao)('encounter'),
        getPatient:genericController(connection)(dao)('patient','patient_id'),
        getObs:genericController(connection)(dao)('obs'),
        getPerson:genericController(connection)(dao)('person','person_id'),
        getPersonName:genericController(connection)(dao)('person_name','person_id'),
        getPersonAddress:genericController(connection)(dao)('person_address','person_id'),
        getLocation:genericController(connection)(dao)('location'),
        getConcept:genericController(connection)(dao)('concept'),
        getConceptAnswer:genericController(connection)(dao)('concept_answer'),
        getConceptName:genericController(connection)(dao)('concept_name'),
        getLocationTag:genericController(connection)(dao)('location_tag'),
        getLocationAttribute:genericController(connection)(dao)('location_attribute'),
        getLocationAttributeType:genericController(connection)(dao)('location_attribute_type')
        
}
export default controller;
