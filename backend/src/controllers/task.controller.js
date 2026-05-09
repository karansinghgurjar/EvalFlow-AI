const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

const getTasks = asyncHandler(async function (req, res) {
  const { status, projectId, assignedToId } = req.query;

  const where = {
    ...(status ? { status } : {}),
    ...(projectId ? { projectId } : {}),
  };

  if (req.user.role === "ANNOTATOR") {
    where.assignedToId = req.user.id;
  } else if (assignedToId) {
    where.assignedToId = assignedToId;
  }

  const tasks = await prisma.task.findMany({
    where,
    include: {
      project: {
        select: {
          id: true,
          title: true,
          domain: true,
          status: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      evaluation: {
        select: {
          id: true,
          status: true,
          overallScore: true,
          issueType: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json({
    tasks,
  });
});

const createTask = asyncHandler(async function (req, res) {
  const {
    projectId,
    prompt,
    response,
    category,
    difficulty,
    assignedToId,
    status,
    dueDate,
  } = req.body;

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

  if (assignedToId) {
    const assignee = await prisma.user.findUnique({
      where: {
        id: assignedToId,
      },
    });

    if (!assignee) {
      return res.status(404).json({
        message: "Assigned user not found",
      });
    }

    if (assignee.role !== "ANNOTATOR") {
      return res.status(400).json({
        message: "Tasks can only be assigned to annotators",
      });
    }
  }

  const task = await prisma.task.create({
    data: {
      projectId,
      prompt,
      response,
      category,
      difficulty: difficulty || "MEDIUM",
      assignedToId: assignedToId || null,
      status: status || "PENDING",
      dueDate: dueDate ? new Date(dueDate) : null,
    },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          domain: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  res.status(201).json({
    message: "Task created successfully",
    task,
  });
});

const getTaskById = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const task = await prisma.task.findUnique({
    where: {
      id,
    },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          description: true,
          domain: true,
          status: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      evaluation: {
        include: {
          annotator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          reviewer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  if (req.user.role === "ANNOTATOR" && task.assignedToId !== req.user.id) {
    return res.status(403).json({
      message: "Forbidden. You can only view tasks assigned to you.",
    });
  }

  res.json({
    task,
  });
});

const updateTask = asyncHandler(async function (req, res) {
  const { id } = req.params;
  const {
    prompt,
    response,
    category,
    difficulty,
    assignedToId,
    status,
    dueDate,
  } = req.body;

  const existingTask = await prisma.task.findUnique({
    where: {
      id,
    },
  });

  if (!existingTask) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  if (assignedToId) {
    const assignee = await prisma.user.findUnique({
      where: {
        id: assignedToId,
      },
    });

    if (!assignee) {
      return res.status(404).json({
        message: "Assigned user not found",
      });
    }

    if (assignee.role !== "ANNOTATOR") {
      return res.status(400).json({
        message: "Tasks can only be assigned to annotators",
      });
    }
  }

  const task = await prisma.task.update({
    where: {
      id,
    },
    data: {
      ...(prompt !== undefined ? { prompt } : {}),
      ...(response !== undefined ? { response } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(difficulty !== undefined ? { difficulty } : {}),
      ...(assignedToId !== undefined ? { assignedToId } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(dueDate !== undefined
        ? { dueDate: dueDate ? new Date(dueDate) : null }
        : {}),
    },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          domain: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  res.json({
    message: "Task updated successfully",
    task,
  });
});

const assignTask = asyncHandler(async function (req, res) {
  const { id } = req.params;
  const { assignedToId } = req.body;

  const task = await prisma.task.findUnique({
    where: {
      id,
    },
  });

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const assignee = await prisma.user.findUnique({
    where: {
      id: assignedToId,
    },
  });

  if (!assignee) {
    return res.status(404).json({
      message: "Assigned user not found",
    });
  }

  if (assignee.role !== "ANNOTATOR") {
    return res.status(400).json({
      message: "Tasks can only be assigned to annotators",
    });
  }

  const updatedTask = await prisma.task.update({
    where: {
      id,
    },
    data: {
      assignedToId,
      status: task.status === "PENDING" ? "IN_PROGRESS" : task.status,
    },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          domain: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  res.json({
    message: "Task assigned successfully",
    task: updatedTask,
  });
});

module.exports = {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  assignTask,
};
