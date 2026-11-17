const bcrypt = require("bcryptjs");
const {
  findUserByEmail,
  findUserById,
  createUser
} = require("../services/userService");
const { generateToken } = require("../utils/token");

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        message: "Name must contain at least 2 characters"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Enter a valid email address"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters"
      });
    }

    const existingUser = findUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        message: "An account with that email already exists"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = createUser({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Unable to register user"
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = findUserByEmail(email.trim());

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = generateToken(user);

    return res.json({
      message: "Login successful",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Unable to log in"
    });
  }
}

function getCurrentUser(req, res) {
  const user = findUserById(req.user.userId);

  if (!user) {
    return res.status(404).json({
      message: "User no longer exists"
    });
  }

  return res.json({
    user: sanitizeUser(user)
  });
}

module.exports = {
  register,
  login,
  getCurrentUser
};