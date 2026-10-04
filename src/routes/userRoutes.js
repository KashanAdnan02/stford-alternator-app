const express = require("express");
const { getCurrentUser, login, register } = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, msg: "Too many authentication attempts. Please try again later." },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/me", requireAuth, getCurrentUser);

module.exports = router;
