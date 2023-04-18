const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

const appRoute = require('./routes/routes');
app.use('/', appRoute);

app.listen(8000, () => console.log('App running on port : 8000'));