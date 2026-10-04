const app = require("../src/app");
const connectDatabase = require("../src/config/database");

module.exports = async (req, res) => {
  try {
    const requestPath = (req.url || "/").split("?")[0];
    if (requestPath === "/" || requestPath === "/api/health") {
      return app(req, res);
    }

    if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
      throw new Error("MONGO_URI and JWT_SECRET must be set in the environment.");
    }

    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Serverless API request failed:", error);
    return res.status(500).json({ success: false, msg: "Unable to connect to the API." });
  }
};
