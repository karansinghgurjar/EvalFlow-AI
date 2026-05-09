const bcrypt = require("bcryptjs");

const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");

const register = asyncHandler(async function (req, res) {
  const { name, email, password, role } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return res.status(409).json({
      message: "User with this email already exists",
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: role || "ANNOTATOR",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const token = generateToken(user.id);

  return res.status(201).json({
    message: "Registration successful",
    token,
    user,
  });
});

const login = asyncHandler(async function (req, res) {
  const { email, password } = req.body;

  const userWithPassword = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!userWithPassword) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    userWithPassword.passwordHash
  );

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const user = {
    id: userWithPassword.id,
    name: userWithPassword.name,
    email: userWithPassword.email,
    role: userWithPassword.role,
    createdAt: userWithPassword.createdAt,
  };

  const token = generateToken(user.id);

  return res.json({
    message: "Login successful",
    token,
    user,
  });
});

const getMe = asyncHandler(async function (req, res) {
  return res.json({
    user: req.user,
  });
});

module.exports = {
  register,
  login,
  getMe,
};
