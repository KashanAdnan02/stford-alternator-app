require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  require("./config/validateEnvironment")();

  await connectDatabase();
  app.listen(port, () => console.log(`API listening on port ${port}`));
}

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exitCode = 1;
});
