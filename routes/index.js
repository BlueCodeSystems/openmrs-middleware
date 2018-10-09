import express from 'express';
let router = express.Router();
import locationController from '../controllers/locationController';

const ROUTE = {location:"/location"
    }



/* GET home page. */
router.get(`${ROUTE.location}/`, locationController.getAllLocations);

router.get(`${ROUTE.location}/:datetime`, locationController.getLocationDatetimeNewerThan);

export default router;