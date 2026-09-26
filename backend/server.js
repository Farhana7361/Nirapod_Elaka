const dns = require('dns');
// Set DNS servers 
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { co2 } = require('@tgwf/co2');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ---- Carbon Footprint Tracking Middleware ----
// Initialize CO2.js with the Sustainable Web Design model
const co2Emission = new co2({ model: 'swd' });

// Middleware to calculate data transfer size
app.use((req, res, next) => {
  let requestBytes = 0;
  let responseBytes = 0;

  // Calculate request size
  if (req.body) {
    requestBytes = Buffer.byteLength(JSON.stringify(req.body), 'utf8');
  }
  if (req.query) {
    requestBytes += Buffer.byteLength(JSON.stringify(req.query), 'utf8');
  }
  if (req.headers) {
    requestBytes += Buffer.byteLength(JSON.stringify(req.headers), 'utf8');
  }

  // Override res.write to calculate response size
  const originalWrite = res.write;
  const originalEnd = res.end;

  res.write = function (chunk) {
    if (chunk) {
      responseBytes += Buffer.byteLength(chunk, 'utf8');
    }
    originalWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) {
      responseBytes += Buffer.byteLength(chunk, 'utf8');
    }
    // Store total bytes
    res.locals.totalBytes = requestBytes + responseBytes;
    // Calculate carbon emissions
    const greenHost = false; // Set to true if your server is hosted on a green host
    const emissions = co2Emission.perByte(res.locals.totalBytes, greenHost);
    console.log(`Data transferred: ${res.locals.totalBytes} bytes`);
    console.log(`Estimated CO2 emissions: ${emissions.toFixed(3)} grams`);
    originalEnd.apply(res, arguments);
  };

  next();
});
// ---- End Carbon Footprint Tracking Middleware ----

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/moderation", require("./routes/moderationRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { family: 4 })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });

// Routes
app.get("/", (req, res) => {
  res.send("Nirapod Elaka Server Running");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});