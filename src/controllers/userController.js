const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function createToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function publicUser(user) {
  return {
    name: user.name,
    email: user.email,
  };
}

async function register(req, res) {
  const { name, email, phoneNo, password } = req.body || {};
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const validEmail =
    normalizedEmail.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  if (
    typeof name !== "string" ||
    typeof phoneNo !== "string" ||
    typeof password !== "string" ||
    !name.trim() ||
    name.trim().length > 100 ||
    !validEmail ||
    !phoneNo.trim() ||
    phoneNo.trim().length > 32 ||
    password.length < 8 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return res.status(400).json({
      success: false,
      msg: "Enter a valid name, email, phone number, and a password of 8 to 72 bytes.",
    });
  }

  try {
    const existingUser = await User.exists({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ success: false, msg: "Email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phoneNo: phoneNo.trim(),
      password: passwordHash,
    });

    return res.status(201).json({
      success: true,
      msg: "Account created successfully.",
      token: createToken(user.id),
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, msg: "Email is already registered." });
    }
    console.error("Registration failed:", error);
    return res.status(500).json({ success: false, msg: "Unable to create account." });
  }
}

async function login(req, res) {
  const { email, password } = req.body || {};
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return res.status(400).json({ success: false, msg: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, msg: "Email or password is incorrect." });
    }

    return res.json({
      success: true,
      msg: "Login successful.",
      token: createToken(user.id),
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ success: false, msg: "Unable to log in." });
  }
}

async function getCurrentUser(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found." });
    }
    return res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    console.error("Fetching current user failed:", error);
    return res.status(500).json({ success: false, msg: "Unable to fetch user." });
  }
}

module.exports = { register, login, getCurrentUser };
