const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Import models
const Event = require("./models/eventModel");
const Subscription = require("./models/subscriptionModel");

// MongoDB Connection
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      console.log("Attempting to connect to MongoDB...");
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("MongoDB connected");
      return true;
    } else {
      console.log("No MongoDB URI provided, using in-memory database");
      return false;
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return false;
  }
};

// In-memory database
const inMemoryDB = {
  events: [],
  registrations: [],
};

// Make in-memory DB available to routes
app.use((req, res, next) => {
  req.db = inMemoryDB;
  next();
});

// Routes
app.use("/api/events", require("./routes/events"));
app.use("/api/registrations", require("./routes/registrations"));

// Endpoint for ticket requests with email collection
app.post("/api/tickets", async (req, res) => {
  try {
    const { eventId, email } = req.body;

    if (!eventId || !email) {
      return res.status(400).json({ error: "Event ID and email are required" });
    }

    // For in-memory testing
    let event;

    // Try to find the event in MongoDB if available
    try {
      event = await Event.findById(eventId);
    } catch (err) {
      console.log("Falling back to in-memory database");
      // Fallback to in-memory database
      event = inMemoryDB.events.find((e) => e._id.toString() === eventId);
    }

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Store the email subscription
    try {
      // Try MongoDB first
      const subscription = new Subscription({
        email,
        eventId,
      });

      await subscription.save();
    } catch (err) {
      console.log("Storing in in-memory database instead");
      // Fallback to in-memory storage
      inMemoryDB.registrations.push({
        email,
        eventId,
        createdAt: new Date(),
      });
    }

    console.log(`New ticket request: ${email} for event ${event.title}`);

    // Construct a redirect URL
    const originalUrl =
      event.originalUrl ||
      `https://www.sydney.com/events/${event.title
        .toLowerCase()
        .replace(/\s+/g, "-")}`;

    // Return success with the URL to redirect to
    return res.status(200).json({
      success: true,
      message: "Email registered successfully",
      originalUrl: originalUrl,
    });
  } catch (error) {
    console.error("Error processing ticket request:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Initialize database and start server
const initializeApp = async () => {
  // Connect to MongoDB
  const isMongoConnected = await connectDB();

  // Start the scraper on a schedule (every 6 hours)
  const { startScraper } = require("./scraper/eventScraper");

  // Only run the scraper in non-Vercel environments or specific Vercel functions
  if (!process.env.VERCEL || process.env.VERCEL_ENV === "development") {
    // Run the scraper immediately
    startScraper(isMongoConnected ? mongoose : inMemoryDB);

    // Schedule scraper to run every 6 hours in non-Vercel environments
    if (!process.env.VERCEL) {
      cron.schedule("0 */6 * * *", () => {
        console.log("Running scheduled event scraper...");
        startScraper(isMongoConnected ? mongoose : inMemoryDB);
      });
    }
  }

  // Start server in development, or just export the app in production for Vercel
  if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
};

// Initialize the application
initializeApp();

// Export app for Vercel
module.exports = app;
