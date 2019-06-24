import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index';
import openmrsConsumer from './consumer/openmrs';

let app = express();

const PORT = process.env.PORT || 8086;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '50mb', extended: true}));

app.use('/', router);

app.listen(PORT, function () {
    console.log(`openmrs-middleware listening on port ${PORT}`);
});

openmrsConsumer.start();
