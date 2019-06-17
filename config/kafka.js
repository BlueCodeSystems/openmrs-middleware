import {Kafka} from "kafkajs";
import config from "./config";

const kafka = new Kafka({clientId:'cool-client',brokers:[config.kafkaBroker]})

export default kafka;