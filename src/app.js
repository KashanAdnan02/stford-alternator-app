const cors = require("cors");
const express = require("express");
const engineRoutes = require("./routes/engineRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.get("/", (_req, res) =>
  res.json({
    success: true,
    msg: "ST Ford Alternator API is running.",
    endpoints: {
      health: "/api/health",
      register: "POST /api/v1/user/register",
      login: "POST /api/v1/user/login",
      currentUser: "POST /api/v1/user/me",
      engine: "GET /api/v2/engine/:serialNumber",
    },
  }),
);
app.get("/api/health", (_req, res) => res.json({ success: true }));
app.use("/api/v2/engine", engineRoutes);
app.use("/api/v1/user", userRoutes);

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ success: false, msg: "Invalid JSON request body." });
  }
  console.error("Request failed:", error);
  return res.status(500).json({ success: false, msg: "Internal server error." });
});

module.exports = app;
