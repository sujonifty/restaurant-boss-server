const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app= express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b9hcdyj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const menuCollection = client.db("restaurantDB").collection("menu");
    const reviewsCollection = client.db("restaurantDB").collection("reviews");
    const cartsCollection = client.db("restaurantDB").collection("carts");
    
    app.get('/menu', async(req, res)=>{
        const result = await menuCollection.find().toArray();
        res.send(result);
    })
    
    
    app.get('/reviews', async(req, res)=>{
        const result = await reviewsCollection.find().toArray();
        res.send(result);
    })
    // carts collection section
    app.post('/carts', async(req, res)=>{
      const cartItem = req.body;
        const result = await cartsCollection.insertOne(cartItem);
        res.send(result);
    })

    app.get('/carts', async(req, res)=>{
      const result = await cartsCollection.find().toArray();
      res.send(result);
  })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', async(req,res)=>{
    res.send('restaurant is running')
})

app.listen(port, ()=>{
    console.log(`restaurant is running on port: ${port}`);
})
