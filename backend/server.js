const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const { co2 } = require("@tgwf/co2");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ---- Carbon Footprint Tracking Middleware ----
const co2Emission = new co2({ model: "swd" });

app.use((req, res, next) => {
  let requestBytes = 0;
  let responseBytes = 0;

  if (req.body) {
    requestBytes = Buffer.byteLength(JSON.stringify(req.body), "utf8");
  }
  if (req.query) {
    requestBytes += Buffer.byteLength(JSON.stringify(req.query), "utf8");
  }
  if (req.headers) {
    requestBytes += Buffer.byteLength(JSON.stringify(req.headers), "utf8");
  }

  const originalWrite = res.write;
  const originalEnd = res.end;

  res.write = function (chunk) {
    if (chunk) {
      responseBytes += Buffer.byteLength(chunk, "utf8");
    }
    return originalWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) {
      responseBytes += Buffer.byteLength(chunk, "utf8");
    }
    res.locals.totalBytes = requestBytes + responseBytes;
    const greenHost = false;
    const emissions = co2Emission.perByte(res.locals.totalBytes, greenHost);
    console.log(`Data transferred: ${res.locals.totalBytes} bytes`);
    console.log(`Estimated CO2 emissions: ${emissions.toFixed(3)} grams`);
    return originalEnd.apply(res, arguments);
  };

  next();
});
// ---- End Carbon Footprint Tracking Middleware ----

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/moderation", require("./routes/moderationRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

// Database Connection
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI, { family: 4 })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("MongoDB Connection Error:", err));
}

// Serve Frontend Static Files
app.use(express.static(path.resolve(__dirname, "../dist")));

// Catch-all route using regex syntax
app.get("(.*)", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "API route not found" });
  }
  const indexPath = path.resolve(__dirname, "../dist", "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send("Nirapod Elaka Server Running");
    }
  });
});

// Start Server locally
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel Serverless
module.exports = app;