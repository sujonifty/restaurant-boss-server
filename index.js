const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const usersCollection = client.db("restaurantDB").collection("users");
    const reviewsCollection = client.db("restaurantDB").collection("reviews");
    const cartsCollection = client.db("restaurantDB").collection("carts");
    
    //users related api
    app.post('/users', async(req, res)=>{
      const user = req.body;
      //insert email if user doesn't exist
      // we can do it many ways(1.email unique, 2. upsert, 3. simple checking)
      const query= {email: user.email};
      const existedUser= await usersCollection.findOne(query);
      if(existedUser){
        return res.send({message:'user already existed', insertedId: null});
      }
        const result = await usersCollection.insertOne(user);
        res.send(result);
    })

    // menu related api
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
      const UserEmail= req.query.email;
      const query ={email: UserEmail};
      const result = await cartsCollection.find(query).toArray();
      res.send(result);
  })
    app.delete('/carts/:id', async(req, res)=>{
      const id= req.params.id;
      const query ={_id: new ObjectId(id)};
      const result = await cartsCollection.deleteOne(query);
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
