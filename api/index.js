const app = require("../src/app");
const connectDatabase = require("../src/config/database");
const validateEnvironment = require("../src/config/validateEnvironment");

module.exports = async (req, res) => {
  try {
    const requestPath = (req.url || "/").split("?")[0];
    if (requestPath === "/" || requestPath === "/api/health") {
      return app(req, res);
    }

    validateEnvironment();
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Serverless API request failed:", error);
    return res.status(500).json({ success: false, msg: "Unable to connect to the API." });
  }
};
