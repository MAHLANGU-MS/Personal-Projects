const connect = require("./connect");//get the connection to the database - by getting the exported modules// this fully runs the file

const express = require("express");
const cors = require("cors");
const taskRoutes = require("./postRoutes");

const app = express();

const port = process.env.PORT || 3000;

// Initialize database connection
let dbConnection;

app.use(cors());
app.use(express.json());//dont have to call json.parse() everytime we want to parse the body of the request

// Use the task routes from postRoutes.js
app.use("/api", taskRoutes);

// Start the server and connect to the database
async function startServer() {
    try {
        // Connect to MongoDB
        await connect.connectToServer();
        
        // Start the Express server regardless of MongoDB connection
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error("Failed to start server with MongoDB:", err);
        // Start the server anyway, even if MongoDB connection fails
        app.listen(port, () => {
            console.log(`Server is running on port ${port} (without MongoDB connection)`);
        });
    }
}

startServer();






