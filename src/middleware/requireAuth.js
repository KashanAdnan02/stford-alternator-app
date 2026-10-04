const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const authorization = req.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : req.body?.token;

  if (!token) {
    return res.status(401).json({ success: false, msg: "Authentication required." });
  }

  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET).sub;
    return next();
  } catch {
    return res.status(401).json({ success: false, msg: "Invalid or expired token." });
  }
}

module.exports = requireAuth;
