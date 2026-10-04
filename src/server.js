require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error("MONGO_URI and JWT_SECRET must be set in the environment.");
  }

  await connectDatabase();
  app.listen(port, () => console.log(`API listening on port ${port}`));
}

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exitCode = 1;
});
