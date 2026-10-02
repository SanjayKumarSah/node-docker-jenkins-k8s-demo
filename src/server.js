import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Hello from Node.js!",
    version: process.env.APP_VERSION || "1.0.0",
    hostname: process.env.HOSTNAME || "local",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

app.get("/api/info", (req, res) => {
  res.json({
    application: "node-docker-jenkins-k8s-demo",
    nodeVersion: process.version,
    platform: process.platform
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});