const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }))

const appRoute = require('./routes/routes');
app.use('/', appRoute);

app.listen(process.env.PORT, () => console.log(`App running on port : ${process.env.PORT}`));