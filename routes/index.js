import express from 'express';
let router = express.Router();

import { CONTROLLERS } from "../controllers/controllers";
import { openmrsAuthorization, requestSessionToken, verifySessionToken } from "../middleware/authentication";

const SUB_URL = "middleware/rest";

router.get(`/${SUB_URL}/session`,openmrsAuthorization, requestSessionToken);

router.use(verifySessionToken);

CONTROLLERS.forEach( controller => {

    router.get(`/${SUB_URL}/${controller.resourceRoute}/`, controller.getAllResources);

    router.get(`^/${SUB_URL}/${controller.resourceRoute}/:uuid([0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12})`, controller.getResourcesByUUID);

    router.get(`^/${SUB_URL}/${controller.resourceRoute}/:uuid([0-9A]{36})`, controller.getResourcesByUUID);

    router.get(`^/${SUB_URL}/${controller.resourceRoute}/:datetime(((-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$))`, controller.getResourcesByDatetimeNewerThan);
});

export default router;
