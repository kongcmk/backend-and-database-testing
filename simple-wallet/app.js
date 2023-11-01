const express = require('express');
const app = express()
require('dotenv').config();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const allowedMethods = ['GET', 'PUT', 'POST', 'DELETE'];
const allowedHeaders = ['Authorization', 'Content-Type']

//middleware
app.use(cors({
    origin: '*',
    methods: allowedMethods.join(', '),
    allowedHeaders: allowedHeaders.join(', '),
    credentials: true,
    optionsSuccessStatus: 204
}))
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true}));


//API


//test server
app.get('/', (req,res) => {
    res.status(200).send("start server")
});











const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server run on http://localhost:${PORT}`)
})