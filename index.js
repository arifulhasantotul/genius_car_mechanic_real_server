const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nebgy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

async function run() {
   try {
      await client.connect();
      // connection check
      const database = client.db("geniusCarMechanic");
      const servicesCollection = database.collection("services");
      // GET API
      app.get("/services", async (req, res) => {
         const cursor = servicesCollection.find({});
         const services = await cursor.toArray();
         res.send(services);
      });

      // GET SINGLE SERVICE
      app.get("/services/:id", async (req, res) => {
         const id = req.params.id;
         console.log("getting specific service");
         const query = { _id: ObjectId(id) };
         const service = await servicesCollection.findOne(query);
         res.json(service);
      });

      // POST API
      app.post("/services", async (req, res) => {
         const newService = req.body;
         console.log("hit the post api", newService);
         const result = await servicesCollection.insertOne(newService);
         res.json(result);
      });

      // DELETE API
      app.delete("/services/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) };
         const result = await servicesCollection.deleteOne(query);
         console.log("deleted result", result);
         res.json(result);
      });
      console.log("connected to db");
   } finally {
      // await client.close()
   }
}
run().catch(console.dir);

app.get("/", (req, res) => {
   res.send("running genius server");
});
app.listen(port, () => {
   console.log("running Genius server on port", port);
});
