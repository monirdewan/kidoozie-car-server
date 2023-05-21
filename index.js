const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors =require("cors");
const app  = express();
const port = process.env.PORT || 5000;

//middleWare
app.use(cors());
app.use(express.json());

//mongoDB


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.birk0vz.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const carCollection = client.db('kidooziecarDB').collection('cars');
    app.get('/products', async (req, res) => {
      const limit = 20; // Set the data limit to 20
      const result = await carCollection.find().limit(limit).toArray();
      res.send(result);
    });
    app.get('/productDetails/:id', async(req, res)=>{
      const id = req.params.id;
      const result = await carCollection.findOne({
        _id: new ObjectId(id)
      })
      res.send(result)
    });

    app.get('/products/:category', async(req, res)=>{
      const categoryfind = req.params.category;
      const result = await carCollection.find({
        subCategory: categoryfind
      }).toArray();
      res.send(result)
    })
    app.get('/myProducts/:email', async(req, res)=>{
      const findEmail = req.params.email;
      const result = await carCollection.find({sEmail:findEmail}).toArray()
      res.send(result)
    })

    app.post('/add-toy', async(req,res)=>{
        const body = req.body;
        body.createdAt = new Date();
        const result = await carCollection.insertOne(body);
        res.send(result)
    })

    
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send("Kidoozie car server is running")
})

app.listen(port, ()=>{
    console.log("kidoozie server is running on port:", port)
})