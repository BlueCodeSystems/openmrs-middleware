import moment from "moment";
import axios from "axios";
import {Kafka} from "kafkajs";
import config from "../config/config";
import dbConnection from '../resources/dbConnection';
import dao from "../dao/daoGenerator"
let fs=require('fs');
let path=require('path');

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

//get image from gallery
let getImageById=(request,response)=>
{
    //image gallery directory
    //insert directory to images here
   let imgDirectory = process.env.IMAGE_DIRECTORY;
  
    //get the image id from the url
    let img=request.params.id;

       fs.readFile(imgDirectory+"/"+img+".png",(err,data)=>
      
       {
           if(err)
           {
               response.send("no such image");
              
               console.log(err);
           }
           else{
            response.writeHead(200,{'Content-type':'image/png'});
            response.end(data);
            console.log("success");

           }
        });
    }

 let getProviderData = connection => doa => async(req, res) => {

    let user = req.data.user
    let provider = (await doa.getProviderByUser(connection)(user.uuid))[0][0]
    user.providerId = provider.provider_id
    user.userId = provider.user_id
    let attributes = ((await doa.getProviderAttributeByAttributeTypeUuid(connection)(user.providerId)('c34fac13-9c48-4f29-beb1-04c8d0a86754'))[0]).map(result => result.value)
    user.location = (await doa.getLocationByUuid(connection)(attributes))[0]
    res.json(req.data)
 }

let doaControllerGenerator = controllerGenerator([getAllResoures, getResourcesByUUID, getResourcesByDatetimeNewerThan, datetimeFormatter,putResource(producer)])

let controller = {
	doaControllerGenerator,
        getId,
        getProviderData:getProviderData(connection)(dao),
        getImageById
        
}
export default controller;
