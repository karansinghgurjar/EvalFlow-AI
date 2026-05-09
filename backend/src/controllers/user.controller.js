const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

const getUsers = asyncHandler(async function (req, res) {
  const role = req.query.role;

  const users = await prisma.user.findMany({
    where: role ? { role } : undefined,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          assignedTasks: true,
          evaluations: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json({
    users,
  });
});

const getUserById = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      assignedTasks: {
        select: {
          id: true,
          prompt: true,
          status: true,
          difficulty: true,
          dueDate: true,
          project: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
      evaluations: {
        select: {
          id: true,
          status: true,
          overallScore: true,
          createdAt: true,
          task: {
            select: {
              id: true,
              prompt: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json({
    user,
  });
});

const updateUserRole = asyncHandler(async function (req, res) {
  const { id } = req.params;
  const { role } = req.body;

  if (id === req.user.id) {
    return res.status(400).json({
      message: "You cannot change your own role",
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!existingUser) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: {
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });

  res.json({
    message: "User role updated successfully",
    user: updatedUser,
  });
});

module.exports = {
  getUsers,
  getUserById,
  updateUserRole,
};
