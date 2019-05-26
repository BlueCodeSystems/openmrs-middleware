import moment from "moment";
import axios from "axios";
import {Kafka} from "kafkajs";
import config from "./config";


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
    
    req.body.map(message => messages.push({
        value:JSON.stringify({
            entity:message,
            locationUuid: req.params['locationUuid'],
            timestamp: moment.now()
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

export default controllerGenerator([getAllResoures, getResourcesByUUID, getResourcesByDatetimeNewerThan, datetimeFormatter,putResource(producer)]);