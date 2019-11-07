import express from 'express';
let router = express.Router();

import { CONTROLLERS } from "../controllers/controllers";
import controller from "../controllers/controllerGenerator";
import { openmrsAuthorization, requestSessionToken, verifySessionToken } from "../middleware/authentication";

const SUB_URL = "middleware/rest";

const SUB_URL_V1 = "middleware/rest/v1";

const routeParams = `location/:locationId/limit/:datetime/:offset/:limit`

const routeParamsNoLocation = `limit/:datetime/:offset/:limit`

router.get(`/${SUB_URL}/session`,openmrsAuthorization, requestSessionToken, controller.getProviderData);

router.use(verifySessionToken);

router.post(`/smartcerv/edi/upload/`,controller.uploadFiles);

router.get(`/${SUB_URL}/idgen/:source(\\d+)/:batchSize(\\d+)`,controller.getId);

//GET patient identifier
router.get(`/${SUB_URL_V1}/patient/identifier/${routeParams}`,controller.getPatientIdentifier);

//GET visit
router.get(`/${SUB_URL_V1}/visit/${routeParams}`,controller.getVisit);

//GET encounter
router.get(`/${SUB_URL_V1}/encounter/${routeParams}`,controller.getEncounter);

//GET obs
router.get(`/${SUB_URL_V1}/obs/${routeParams}`,controller.getObs);

//GET patient
router.get(`/${SUB_URL_V1}/patient/${routeParams}`,controller.getPatient);

//GET person
router.get(`/${SUB_URL_V1}/person/${routeParams}`,controller.getPerson);

//GET person name
router.get(`/${SUB_URL_V1}/person/name/${routeParams}`,controller.getPersonName);

//GET person address
router.get(`/${SUB_URL_V1}/person/address/${routeParams}`,controller.getPersonAddress);

//GET location
router.get(`/${SUB_URL_V1}/location/${routeParamsNoLocation}`,controller.getLocation);

//GET location tag
router.get(`/${SUB_URL_V1}/location/tag/${routeParamsNoLocation}`,controller.getLocationTag);

//GET location tag
router.get(`/${SUB_URL_V1}/location/attribute/${routeParamsNoLocation}`,controller.getLocationAttribute);

//GET location tag
router.get(`/${SUB_URL_V1}/location/attribute/type/${routeParamsNoLocation}`,controller.getLocationAttributeType);

router.get(`/${SUB_URL_V1}/concept/${routeParamsNoLocation}`,controller.getConcept);

router.get(`/${SUB_URL_V1}/concept/answer/${routeParamsNoLocation}`,controller.getConceptAnswer);

router.get(`/${SUB_URL_V1}/concept/name/${routeParamsNoLocation}`,controller.getConceptName);



CONTROLLERS.forEach( controller => {

    router.get(`/${SUB_URL}/${controller.resourceRoute}/`, controller.getAllResources);

    router.put(`/${SUB_URL}/${controller.resourceRoute}/:batchVersion(\\d+)`, controller.putResource);

    router.get(`^/${SUB_URL}/${controller.resourceRoute}/:uuid([0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12})`, controller.getResourcesByUUID);

    router.get(`^/${SUB_URL}/${controller.resourceRoute}/:uuid([0-9A]{36})`, controller.getResourcesByUUID);

    router.get(`^/${SUB_URL}/${controller.resourceRoute}/:datetime(((-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$))`, controller.getResourcesByDatetimeNewerThan);
});


export default router;
