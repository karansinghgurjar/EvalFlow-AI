const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

function mapCountByKey(items, keyName) {
  return items.map((item) => ({
    [keyName]: item[keyName],
    count:
      typeof item._count === "number"
        ? item._count
        : item._count?.[keyName] || 0,
  }));
}

const getAdminDashboard = asyncHandler(async function (req, res) {
  const [
    totalUsers,
    totalProjects,
    activeProjects,
    totalTasks,
    pendingTasks,
    submittedTasks,
    approvedTasks,
    rejectedTasks,
    totalEvaluations,
    averageScoreResult,
    taskStatusGroups,
    projectStatusGroups,
    topAnnotators,
    recentEvaluations,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.project.count({
      where: {
        status: "ACTIVE",
      },
    }),
    prisma.task.count(),
    prisma.task.count({
      where: {
        status: "PENDING",
      },
    }),
    prisma.task.count({
      where: {
        status: "SUBMITTED",
      },
    }),
    prisma.task.count({
      where: {
        status: "APPROVED",
      },
    }),
    prisma.task.count({
      where: {
        status: "REJECTED",
      },
    }),
    prisma.evaluation.count(),
    prisma.evaluation.aggregate({
      _avg: {
        overallScore: true,
      },
    }),
    prisma.task.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    }),
    prisma.project.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    }),
    prisma.user.findMany({
      where: {
        role: "ANNOTATOR",
      },
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            assignedTasks: true,
            evaluations: true,
          },
        },
        evaluations: {
          select: {
            overallScore: true,
            status: true,
          },
        },
      },
      take: 5,
    }),
    prisma.evaluation.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        annotator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        task: {
          select: {
            id: true,
            prompt: true,
            status: true,
            project: {
              select: {
                id: true,
                title: true,
                domain: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const formattedTopAnnotators = topAnnotators.map((annotator) => {
    const approvedEvaluations = annotator.evaluations.filter(
      (evaluation) => evaluation.status === "APPROVED"
    );

    const averageScore =
      annotator.evaluations.length > 0
        ? annotator.evaluations.reduce(
            (sum, evaluation) => sum + evaluation.overallScore,
            0
          ) / annotator.evaluations.length
        : 0;

    return {
      id: annotator.id,
      name: annotator.name,
      email: annotator.email,
      assignedTasks: annotator._count.assignedTasks,
      evaluations: annotator._count.evaluations,
      approvedEvaluations: approvedEvaluations.length,
      averageScore: Number(averageScore.toFixed(2)),
    };
  });

  res.json({
    metrics: {
      totalUsers,
      totalProjects,
      activeProjects,
      totalTasks,
      pendingTasks,
      submittedTasks,
      approvedTasks,
      rejectedTasks,
      totalEvaluations,
      averageQualityScore: Number(
        (averageScoreResult._avg.overallScore || 0).toFixed(2)
      ),
    },
    charts: {
      taskStatusDistribution: mapCountByKey(taskStatusGroups, "status"),
      projectStatusDistribution: mapCountByKey(projectStatusGroups, "status"),
    },
    topAnnotators: formattedTopAnnotators,
    recentEvaluations,
  });
});

const getAnnotatorDashboard = asyncHandler(async function (req, res) {
  const annotatorId = req.user.id;

  const [
    assignedTasks,
    pendingTasks,
    inProgressTasks,
    submittedTasks,
    approvedTasks,
    rejectedTasks,
    myEvaluations,
    averageScoreResult,
    taskStatusGroups,
    recentTasks,
    rejectedEvaluations,
  ] = await Promise.all([
    prisma.task.count({
      where: {
        assignedToId: annotatorId,
      },
    }),
    prisma.task.count({
      where: {
        assignedToId: annotatorId,
        status: "PENDING",
      },
    }),
    prisma.task.count({
      where: {
        assignedToId: annotatorId,
        status: "IN_PROGRESS",
      },
    }),
    prisma.task.count({
      where: {
        assignedToId: annotatorId,
        status: "SUBMITTED",
      },
    }),
    prisma.task.count({
      where: {
        assignedToId: annotatorId,
        status: "APPROVED",
      },
    }),
    prisma.task.count({
      where: {
        assignedToId: annotatorId,
        status: "REJECTED",
      },
    }),
    prisma.evaluation.count({
      where: {
        annotatorId,
      },
    }),
    prisma.evaluation.aggregate({
      where: {
        annotatorId,
      },
      _avg: {
        overallScore: true,
      },
    }),
    prisma.task.groupBy({
      by: ["status"],
      where: {
        assignedToId: annotatorId,
      },
      _count: {
        status: true,
      },
    }),
    prisma.task.findMany({
      where: {
        assignedToId: annotatorId,
      },
      take: 5,
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            domain: true,
          },
        },
        evaluation: {
          select: {
            id: true,
            status: true,
            overallScore: true,
            reviewerFeedback: true,
          },
        },
      },
    }),
    prisma.evaluation.findMany({
      where: {
        annotatorId,
        status: "REJECTED",
      },
      take: 5,
      orderBy: {
        reviewedAt: "desc",
      },
      include: {
        task: {
          select: {
            id: true,
            prompt: true,
            project: {
              select: {
                id: true,
                title: true,
              },
            },
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
    }),
  ]);

  res.json({
    metrics: {
      assignedTasks,
      pendingTasks,
      inProgressTasks,
      submittedTasks,
      approvedTasks,
      rejectedTasks,
      myEvaluations,
      averageScore: Number((averageScoreResult._avg.overallScore || 0).toFixed(2)),
      completionRate:
        assignedTasks > 0
          ? Number(
              (((approvedTasks + submittedTasks) / assignedTasks) * 100).toFixed(2)
            )
          : 0,
    },
    charts: {
      taskStatusDistribution: mapCountByKey(taskStatusGroups, "status"),
    },
    recentTasks,
    rejectedEvaluations,
  });
});

const getReviewerDashboard = asyncHandler(async function (req, res) {
  const reviewerId = req.user.id;

  const [
    pendingReview,
    approvedByMe,
    rejectedByMe,
    totalReviewedByMe,
    averageReviewedScore,
    reviewStatusGroups,
    pendingEvaluations,
    recentReviewedEvaluations,
    lowScoreSubmittedEvaluations,
  ] = await Promise.all([
    prisma.evaluation.count({
      where: {
        status: "SUBMITTED",
      },
    }),
    prisma.evaluation.count({
      where: {
        reviewerId,
        status: "APPROVED",
      },
    }),
    prisma.evaluation.count({
      where: {
        reviewerId,
        status: "REJECTED",
      },
    }),
    prisma.evaluation.count({
      where: {
        reviewerId,
        status: {
          in: ["APPROVED", "REJECTED"],
        },
      },
    }),
    prisma.evaluation.aggregate({
      where: {
        reviewerId,
        status: {
          in: ["APPROVED", "REJECTED"],
        },
      },
      _avg: {
        overallScore: true,
      },
    }),
    prisma.evaluation.groupBy({
      by: ["status"],
      where: {
        reviewerId,
      },
      _count: {
        status: true,
      },
    }),
    prisma.evaluation.findMany({
      where: {
        status: "SUBMITTED",
      },
      take: 5,
      orderBy: {
        createdAt: "asc",
      },
      include: {
        annotator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        task: {
          select: {
            id: true,
            prompt: true,
            category: true,
            difficulty: true,
            project: {
              select: {
                id: true,
                title: true,
                domain: true,
              },
            },
          },
        },
      },
    }),
    prisma.evaluation.findMany({
      where: {
        reviewerId,
        status: {
          in: ["APPROVED", "REJECTED"],
        },
      },
      take: 5,
      orderBy: {
        reviewedAt: "desc",
      },
      include: {
        annotator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        task: {
          select: {
            id: true,
            prompt: true,
            project: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    }),
    prisma.evaluation.findMany({
      where: {
        status: "SUBMITTED",
        overallScore: {
          lt: 3,
        },
      },
      take: 5,
      orderBy: {
        overallScore: "asc",
      },
      include: {
        annotator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        task: {
          select: {
            id: true,
            prompt: true,
            category: true,
          },
        },
      },
    }),
  ]);

  res.json({
    metrics: {
      pendingReview,
      approvedByMe,
      rejectedByMe,
      totalReviewedByMe,
      averageReviewedScore: Number(
        (averageReviewedScore._avg.overallScore || 0).toFixed(2)
      ),
      rejectionRate:
        totalReviewedByMe > 0
          ? Number(((rejectedByMe / totalReviewedByMe) * 100).toFixed(2))
          : 0,
    },
    charts: {
      reviewStatusDistribution: mapCountByKey(reviewStatusGroups, "status"),
    },
    pendingEvaluations,
    recentReviewedEvaluations,
    lowScoreSubmittedEvaluations,
  });
});

module.exports = {
  getAdminDashboard,
  getAnnotatorDashboard,
  getReviewerDashboard,
};
