const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

const getProjects = asyncHandler(async function (req, res) {
  const status = req.query.status;
  const domain = req.query.domain;

  const projects = await prisma.project.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(domain ? { domain } : {}),
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      _count: {
        select: {
          tasks: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json({
    projects,
  });
});

const createProject = asyncHandler(async function (req, res) {
  const { title, description, domain, status, deadline } = req.body;

  const project = await prisma.project.create({
    data: {
      title,
      description,
      domain,
      status: status || "DRAFT",
      deadline: deadline ? new Date(deadline) : null,
      createdById: req.user.id,
    },
    include: {
      createdBy: {
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
    message: "Project created successfully",
    project,
  });
});

const getProjectById = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const project = await prisma.project.findUnique({
    where: {
      id,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      tasks: {
        include: {
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
      },
    },
  });

  if (!project) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

  res.json({
    project,
  });
});

const updateProject = asyncHandler(async function (req, res) {
  const { id } = req.params;
  const { title, description, domain, status, deadline } = req.body;

  const existingProject = await prisma.project.findUnique({
    where: {
      id,
    },
  });

  if (!existingProject) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

  const updatedProject = await prisma.project.update({
    where: {
      id,
    },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(domain !== undefined ? { domain } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(deadline !== undefined
        ? { deadline: deadline ? new Date(deadline) : null }
        : {}),
    },
  });

  res.json({
    message: "Project updated successfully",
    project: updatedProject,
  });
});

const deleteProject = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const existingProject = await prisma.project.findUnique({
    where: {
      id,
    },
  });

  if (!existingProject) {
    return res.status(404).json({
      message: "Project not found",
    });
  }

  await prisma.project.update({
    where: {
      id,
    },
    data: {
      status: "ARCHIVED",
    },
  });

  res.json({
    message: "Project archived successfully",
  });
});

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};
