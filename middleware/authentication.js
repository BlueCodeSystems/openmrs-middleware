import jwt from "jsonwebtoken";
import axios from "axios";

let openmrsAuthorization = async(req, res, next) => {

    const CREDINTIALS = req.headers.authorization;

    const SESSION_ROUTE = '/ws/rest/v1/session';

    if(CREDINTIALS == null)
        return res.sendStatus(401);

    const AUTH_STATUS = await axios.get(`${process.env.OPENMRS_SITE}${SESSION_ROUTE}`,
        {
            headers:{Authorization: CREDINTIALS}
        }
    );

    req.authorizationStatus = AUTH_STATUS.data;

    next();
}

let requestSessionToken = async(req, res) => {

    if(req.authorizationStatus == null)
        return res.sendStatus(401);

    const authorizationStatus = req.authorizationStatus;

    if(authorizationStatus.authenticated){

        let userdetails = authorizationStatus.user;

        const user = {
            uuid: userdetails.uuid,
		    display: userdetails.display,
		    username: userdetails.username,
		    systemId: userdetails.systemId
        }

        const TOKEN = jwt.sign({user}, `${process.env.SECRET_KEY}`, { expiresIn: Number(process.env.SESSION_EXPIRATION) });

        return res.json({user,token: TOKEN})
    }
    else
         return res.sendStatus(401);
}

let verifySessionToken = (req, res,next) => {

    const TOKEN = req.headers['x-access-token'];

    if(TOKEN == null)
        return res.sendStatus(401);

    const decoded = jwt.verify(TOKEN, `${process.env.SECRET_KEY}`);

    if(decoded != null){
        req.user = decoded;
        next();
    }  
    else
        return res.sendStatus(401);
}

export {openmrsAuthorization, requestSessionToken, verifySessionToken}