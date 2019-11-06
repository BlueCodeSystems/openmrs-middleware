
let config = {
   openmrsRestApiRoute:process.env.OPENMRS_REST_API_ROUTE,
   kafkaBroker:process.env.KAFKA_BROKER,
   openmrsUrl:process.env.OPENMRS_SITE,
   openmrsAdminUsername:process.env.OPENMRS_ADMIN_USERNAME,
   openmrsAdminPassword:process.env.OPENMRS_ADMIN_PASSWORD,
   ediDirectory:process.env.EDI_DIR 
}

export default config;
