const express = require('express')
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    res.send('Welcome to database backend')
})

const uri = "mongodb+srv://doctorsportal:adgjmptw499@cluster0.oawso.mongodb.net/doctors-portal?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


//Add services to database
app.post("/addServices", (req, res) => {
    const services = req.body;
    client.connect(err => {
        const collection = client.db("doctors-portal").collection("appointments");
        collection.insertMany(services)
            .then((result) => {
                res.send(result)
            })
    });
})

//get service data from the server
app.get("/getServices", (req, res) => {
    client.connect((error) => {
        const collection = client.db("doctors-portal").collection("appointments");
        collection.find().toArray((err, documents) => {
            if (err) {
                console.log(err);
                console.log(error)
                res.status(500).send({
                    message: err
                });
            } else {
                res.send(documents);
            }
        });
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('listening on port 5000')
})