module.exports = function validateEnvironment() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be set in the environment.");
  }
  if (!process.env.JWT_SECRET || Buffer.byteLength(process.env.JWT_SECRET, "utf8") < 32) {
    throw new Error("JWT_SECRET must contain at least 32 bytes.");
  }
};
