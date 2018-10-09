let getAllResoures = dao => async (req, res) => res.json((await dao.getAllData())[0]);

let getResourcesByDatetimeNewerThan = dao => async (req, res) => res.json((await dao.getDataByDatetimeNewerThan(req.params['datetime']))[0]);

let getResourcesByUUID = dao => async (req, res) => res.json((await dao.getDataByUUID(req.params['uuid']))[0]);

let controllerGenerator = callbacks => resourceRoute => dao => (

    {
        resourceRoute : resourceRoute,

        getAllResources: callbacks[0](dao),

        getResourcesByUUID: callbacks[1](dao),

        getResourcesByDatetimeNewerThan: callbacks[2](dao)
    }
)

export default controllerGenerator([getAllResoures, getResourcesByUUID, getResourcesByDatetimeNewerThan]);