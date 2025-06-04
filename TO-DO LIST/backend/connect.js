const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({path: "../config.env"});

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.ATLAS_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let database;

module.exports = {
    connectToServer: async function() {
        try {
            console.log("Attempting to connect to MongoDB...");
            // Connect the client to the server
            await client.connect();
            database = client.db("TOdoLIST");
            console.log("Successfully connected to MongoDB!");
            return database;
        } catch (err) {
            console.error("Error connecting to MongoDB:", err);
            // Check if the error is related to the connection string
            if (err.message && err.message.includes('querySrv ENOTFOUND')) {
                console.error("This appears to be an issue with the MongoDB connection string.");
                console.error("Please verify your MongoDB Atlas cluster name and credentials.");
            }
            throw err;
        }
    },
    //Access the database 
    getDB: function() {
        return database;
    }
}
/*
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}*/
// run().catch(console.dir);
