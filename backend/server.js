require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
const clientRoutes = require("./routes/clientRoutes");
const billRoutes = require("./routes/billRoutes");

// Express app
const app = express();

// Database connection monitoring
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected!");
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Vite's default port
    credentials: true,
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/bills", billRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/jje")
  .then(() => {
    console.log("MongoDB Database connected successfully!");
    // Start server
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Local:   http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("\x1b[31m%s\x1b[0m", "✗ Error connecting to MongoDB:");
    console.error("\x1b[31m%s\x1b[0m", error.message);
    process.exit(1); // Exit process with failure
  });
