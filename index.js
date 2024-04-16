const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// VLIrOgRMf5u4ggse
// coffeeMaster

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ysrfscy.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const coffeeCollections = client.db("coffeeDB").collection("coffee");
    const blogsCollections = client.db("coffeeDB").collection("blogs");

    app.get("/coffee", async (req, res) => {
      const cursor = coffeeCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/blogs', async (req, res) => {
      const cursor = blogsCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/blogs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blogsCollections.findOne(query);
      res.send(result);
    });


    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollections.findOne(query);
      res.send(result);
    });

  

    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollections.insertOne(newCoffee);
      res.send(result);
    });
    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCoffee = req.body;
      const coffee = {
        $set: {
          name: updateCoffee.name,
          quantity: updateCoffee.quantity,
          supplier: updateCoffee.supplier,
          teast: updateCoffee.teast,
          category: updateCoffee.category,
          details: updateCoffee.details,
          photoUrl: updateCoffee.photoUrl,
        },
      };
      const result = await coffeeCollections.updateOne(filter, coffee, options);
      res.send(result);
    });

    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollections.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("coffee maker is running");
});

app.listen(port, () => {
  console.log(`coffee maker is running listening on port ${port}`);
});
