const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

//middle wares
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.19qwu6y.mongodb.net/?retryWrites=true&w=majority`;

const client =  new MongoClient(uri);

  async function run(){
    try{
        await client.connect();
        const categoriesCollection = client.db("resellingBooks").collection("categories");

        app.get('/categories', async(req, res) => {
            const query = {};
            const cursor = categoriesCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories)
        })
    }
    catch(error){
        console.log(error.name, error.message, error.stack);
    }
  }
  run();

app.get('/', (req, res) => {
    res.send('Hello from the other side')
})

app.listen(port, () => {
console.log('Its happening');
})