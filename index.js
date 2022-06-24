const express = require('express');
const { MongoClient } = require('mongodb');



const ObjectId = require('mongodb').ObjectId;





const cors = require('cors')
require('dotenv').config()


const app = express()
const port = process.env.PORT || 5000;


//middle ware...
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hkgq0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db("webvotes");
        const poolCollection = database.collection('poolperson')
        const bookingCollection = database.collection('bookings')



         //get single services
         app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('getting specific id');
            const query = { _id: ObjectId(id) };
            const service = await poolCollection.findOne(query);
            res.json(service);
        })



        //get api for showing all the datta from database...
        app.get('/services', async (req, res) => {
            const cursor = poolCollection.find({});
            const poolman = await cursor.toArray();
            res.send(poolman);
        })




        //post api for sending data to the database from the ui....
        app.post('/services', async (req, res) => {
            const service = req.body;
            // console.log('hit the post', service);
            const result = await poolCollection.insertOne(service);
            // console.log(result);
            res.json(result)
        })


        //booking get API
        app.post('/bookings', async (req, res) => {
            const order = req.body;
            const result = await bookingCollection.insertOne(order);
            // console.log('order', order);
            res.json(result);
        })

          //get my order specific order by email
          app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            if (email) {
                const query = { email: email }
                // console.log(query);
                const cursor = bookingCollection.find(query);
                const services = await cursor.toArray();
                res.send(services);
            }
            else {
                const cursor = bookingCollection.find({});
                const result = await cursor.toArray();
                res.send(result);
            }

        })

       
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('onk  kaj aca ra vai')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})