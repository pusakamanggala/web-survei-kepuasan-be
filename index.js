const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


const appRoute = require('./routes/routes');
app.use('/', appRoute);

const origin = process.env.ORIGIN.split(',')
app.use(cors(
    {
        allowedHeaders: "Authorization",
        credentials: true,
        origin: origin
    }
))

console.log(`CORS set to: ${origin}`)
app.listen(process.env.PORT, () => console.log(`App running on port : ${process.env.PORT}`));