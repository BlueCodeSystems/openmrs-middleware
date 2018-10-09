import locationDao from "../dao/locationDao";



let getAllLocations = locationDao => async (req, res) => {
  
    let locations = await locationDao.getAllLocations();

    res.json(locations[0]);
};

let getLocationDatetimeNewerThan = locationDao => async (req, res) => {

    let datetime = req.params["datetime"]
    console.log("this is you date and time",datetime);
  
    let locations = await locationDao.getLocationDatetimeNewerThan(datetime);

    res.json(locations[0]);
};

let locationController = {

    getLocationDatetimeNewerThan: getLocationDatetimeNewerThan(locationDao),
    getAllLocations: getAllLocations(locationDao)
}

export default locationController;