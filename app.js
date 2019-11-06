import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index';
import openmrsConsumer from './consumer/openmrs';
import fileUpload from 'express-fileupload';
import favicon from 'serve-favicon';
import path from 'path';


let app = express();

const PORT = process.env.PORT || 8086;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(fileUpload());

app.use('/smartcerv',express.static('dist'))

app.use(favicon(path.join(__dirname, 'view','favicon.ico')));

app.use(express.static('dist'))

app.use('/', router);

app.listen(PORT, function () {
    console.log(`openmrs-middleware listening on port ${PORT}`);
});

openmrsConsumer.start();
