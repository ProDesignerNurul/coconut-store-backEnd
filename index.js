const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


// middleware 
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).send(`coconut server is running`)
});




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwnyjff.mongodb.net/?retryWrites=true&w=majority`;

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


    const coconutsCollection = client.db('coconutsDB').collection('coconuts');

    // get/find all 
    app.get('/coconuts', async(req, res) => {
        try {
            const result = await coconutsCollection.find().toArray();
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
        }
    });


    // get/find One 
    app.get('/coconuts/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      console.log(query);

      const result = await coconutsCollection.findOne(query);
      res.status(200).send(result);
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



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is running now at http://localhost:${PORT}`);
});
