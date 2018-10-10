import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index';

let app = express();

const PORT = process.env.PORT || 8086;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', router);

app.listen(PORT, function () {
    console.log(`openmrs-middleware listening on port ${PORT}`);
});