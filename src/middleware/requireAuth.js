const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const authorization = req.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : undefined;

  if (!token) {
    return res.status(401).json({ success: false, msg: "Authentication required." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof payload === "string" || typeof payload.sub !== "string") {
      return res.status(401).json({ success: false, msg: "Invalid or expired token." });
    }
    req.userId = payload.sub;
    return next();
  } catch {
    return res.status(401).json({ success: false, msg: "Invalid or expired token." });
  }
}

module.exports = requireAuth;
