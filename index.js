require('dotenv').config();
const express = require('express')
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;


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
/* const uri =  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oawso.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`; */

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

client.connect(err => {
    const appointmentCollection = client.db("doctors-portal").collection("appointments");
    const bookingsCollection = client.db("doctors-portal").collection("bookingsData");

    //Add services to database
    app.post("/addServices", (req, res) => {
        const services = req.body;
        appointmentCollection.insertMany(services)
            .then((result) => {
                res.send(result)
        })
})

    //get service data from the server
    app.get("/getServices", (req, res) => {
        appointmentCollection.find().toArray((err, documents) => {
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

    //Add appointment data
    app.post('/addBooking',(req, res)=>{
        const booking=req.body
        bookingsCollection.insertOne(booking)
        .then(result=>{
            res.send(result.insertedCount>0)
        })
    })

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('listening on port 5000')
})