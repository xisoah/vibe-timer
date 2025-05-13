require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;
const uri = process.env.MONGODB_URI;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // TODO: Define MongoDB database and collection
    const database = client.db("vibe_timer"); // Replace with your database name
    const vibeSessionsCollection = database.collection("vibe_sessions"); // Replace with your collection name

    // Define API routes here

    // Add a new vibe session
    app.post('/api/vibe-sessions', async (req, res) => {
      try {
        const result = await vibeSessionsCollection.insertOne(req.body);
        res.status(201).json(result);
      } catch (error) {
        console.error("Error adding vibe session:", error);
        res.status(500).json({ message: "Error adding vibe session", error });
      }
    });

    // Fetch vibe sessions for a specific date
    app.get('/api/vibe-sessions', async (req, res) => {
      try {
        const date = req.query.date;
        if (!date) {
          return res.status(400).json({ message: "Date query parameter is required" });
        }
        const vibeSessions = await vibeSessionsCollection.find({ date: date }).toArray();
        res.status(200).json(vibeSessions);
      } catch (error) {
        console.error("Error fetching vibe sessions:", error);
        res.status(500).json({ message: "Error fetching vibe sessions", error });
      }
    });

    // Update a vibe session
    app.put('/api/vibe-sessions/:id', async (req, res) => {
      try {
        const { id } = req.params;
        // In MongoDB, _id is an ObjectId, so we need to convert the id string
        const { ObjectId } = require('mongodb');
        const objectId = new ObjectId(id);

        const result = await vibeSessionsCollection.updateOne(
          { _id: objectId },
          { $set: req.body }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Vibe session not found" });
        }

        res.status(200).json({ message: "Vibe session updated successfully" });
      } catch (error) {
        console.error("Error updating vibe session:", error);
        res.status(500).json({ message: "Error updating vibe session", error });
      }
    });

    // Delete a vibe session
    app.delete('/api/vibe-sessions/:id', async (req, res) => {
      try {
        const { id } = req.params;
        // In MongoDB, _id is an ObjectId, so we need to convert the id string
        const { ObjectId } = require('mongodb');
        const objectId = new ObjectId(id);

        const result = await vibeSessionsCollection.deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Vibe session not found" });
        }

        res.status(200).json({ message: "Vibe session deleted successfully" });
      } catch (error) {
        console.error("Error deleting vibe session:", error);
        res.status(500).json({ message: "Error deleting vibe session", error });
      }
    });


    // Start the Express server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close(); // We won't close the client here as the server needs to keep the connection open
  }
}

run().catch(console.dir);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Vibe Timer Backend is running!');
});

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});