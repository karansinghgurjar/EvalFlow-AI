const prisma = require("../config/prisma");
const asyncHandler = require("../utils/asyncHandler");

function calculateOverallScore({ accuracy, relevance, coherence, safety }) {
  return Number(((accuracy + relevance + coherence + safety) / 4).toFixed(2));
}

const createEvaluation = asyncHandler(async function (req, res) {
  const {
    taskId,
    accuracy,
    relevance,
    coherence,
    safety,
    issueType,
    notes,
    status,
  } = req.body;

  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      evaluation: true,
    },
  });

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  if (task.assignedToId !== req.user.id) {
    return res.status(403).json({
      message: "You can only evaluate tasks assigned to you.",
    });
  }

  if (task.evaluation) {
    return res.status(409).json({
      message: "Evaluation already exists for this task. Please update it instead.",
    });
  }

  const evaluationStatus = status || "DRAFT";
  const overallScore = calculateOverallScore({
    accuracy,
    relevance,
    coherence,
    safety,
  });

  const result = await prisma.$transaction(async function (tx) {
    const evaluation = await tx.evaluation.create({
      data: {
        taskId,
        annotatorId: req.user.id,
        accuracy,
        relevance,
        coherence,
        safety,
        overallScore,
        issueType: issueType || "NONE",
        notes,
        status: evaluationStatus,
      },
      include: {
        task: {
          include: {
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
    });

    await tx.task.update({
      where: {
        id: taskId,
      },
      data: {
        status: evaluationStatus === "SUBMITTED" ? "SUBMITTED" : "IN_PROGRESS",
      },
    });

    return evaluation;
  });

  res.status(201).json({
    message:
      evaluationStatus === "SUBMITTED"
        ? "Evaluation submitted successfully"
        : "Evaluation draft saved successfully",
    evaluation: result,
  });
});

const getEvaluations = asyncHandler(async function (req, res) {
  const { status, taskId, annotatorId } = req.query;

  const where = {
    ...(status ? { status } : {}),
    ...(taskId ? { taskId } : {}),
  };

  if (req.user.role === "ANNOTATOR") {
    where.annotatorId = req.user.id;
  } else if (annotatorId) {
    where.annotatorId = annotatorId;
  }

  if (req.user.role === "REVIEWER" && !status) {
    where.status = "SUBMITTED";
  }

  const evaluations = await prisma.evaluation.findMany({
    where,
    include: {
      task: {
        include: {
          project: {
            select: {
              id: true,
              title: true,
              domain: true,
            },
          },
        },
      },
      annotator: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json({
    evaluations,
  });
});

const getEvaluationById = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const evaluation = await prisma.evaluation.findUnique({
    where: {
      id,
    },
    include: {
      task: {
        include: {
          project: {
            select: {
              id: true,
              title: true,
              description: true,
              domain: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      annotator: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      reviewer: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!evaluation) {
    return res.status(404).json({
      message: "Evaluation not found",
    });
  }

  if (req.user.role === "ANNOTATOR" && evaluation.annotatorId !== req.user.id) {
    return res.status(403).json({
      message: "You can only view your own evaluations.",
    });
  }

  res.json({
    evaluation,
  });
});

const updateEvaluation = asyncHandler(async function (req, res) {
  const { id } = req.params;

  const existingEvaluation = await prisma.evaluation.findUnique({
    where: {
      id,
    },
    include: {
      task: true,
    },
  });

  if (!existingEvaluation) {
    return res.status(404).json({
      message: "Evaluation not found",
    });
  }

  if (existingEvaluation.annotatorId !== req.user.id) {
    return res.status(403).json({
      message: "You can only update your own evaluations.",
    });
  }

  if (!["DRAFT", "REJECTED"].includes(existingEvaluation.status)) {
    return res.status(400).json({
      message: "Only draft or rejected evaluations can be updated.",
    });
  }

  const accuracy =
    req.body.accuracy !== undefined ? req.body.accuracy : existingEvaluation.accuracy;
  const relevance =
    req.body.relevance !== undefined
      ? req.body.relevance
      : existingEvaluation.relevance;
  const coherence =
    req.body.coherence !== undefined
      ? req.body.coherence
      : existingEvaluation.coherence;
  const safety =
    req.body.safety !== undefined ? req.body.safety : existingEvaluation.safety;

  const nextStatus = req.body.status || existingEvaluation.status;
  const overallScore = calculateOverallScore({
    accuracy,
    relevance,
    coherence,
    safety,
  });

  const updatedEvaluation = await prisma.$transaction(async function (tx) {
    const evaluation = await tx.evaluation.update({
      where: {
        id,
      },
      data: {
        accuracy,
        relevance,
        coherence,
        safety,
        overallScore,
        ...(req.body.issueType !== undefined ? { issueType: req.body.issueType } : {}),
        ...(req.body.notes !== undefined ? { notes: req.body.notes } : {}),
        status: nextStatus,
        reviewerId: nextStatus === "SUBMITTED" ? null : existingEvaluation.reviewerId,
        reviewerFeedback:
          nextStatus === "SUBMITTED" ? null : existingEvaluation.reviewerFeedback,
        reviewedAt: nextStatus === "SUBMITTED" ? null : existingEvaluation.reviewedAt,
      },
      include: {
        task: true,
      },
    });

    await tx.task.update({
      where: {
        id: existingEvaluation.taskId,
      },
      data: {
        status: nextStatus === "SUBMITTED" ? "SUBMITTED" : "IN_PROGRESS",
      },
    });

    return evaluation;
  });

  res.json({
    message:
      nextStatus === "SUBMITTED"
        ? "Evaluation submitted successfully"
        : "Evaluation updated successfully",
    evaluation: updatedEvaluation,
  });
});

const reviewEvaluation = asyncHandler(async function (req, res) {
  const { id } = req.params;
  const { status, reviewerFeedback } = req.body;

  const existingEvaluation = await prisma.evaluation.findUnique({
    where: {
      id,
    },
    include: {
      task: true,
    },
  });

  if (!existingEvaluation) {
    return res.status(404).json({
      message: "Evaluation not found",
    });
  }

  if (existingEvaluation.status !== "SUBMITTED") {
    return res.status(400).json({
      message: "Only submitted evaluations can be reviewed.",
    });
  }

  if (status === "REJECTED" && !reviewerFeedback) {
    return res.status(400).json({
      message: "Reviewer feedback is required when rejecting an evaluation.",
    });
  }

  const reviewedEvaluation = await prisma.$transaction(async function (tx) {
    const evaluation = await tx.evaluation.update({
      where: {
        id,
      },
      data: {
        status,
        reviewerId: req.user.id,
        reviewerFeedback: reviewerFeedback || null,
        reviewedAt: new Date(),
      },
      include: {
        task: true,
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
    });

    await tx.task.update({
      where: {
        id: existingEvaluation.taskId,
      },
      data: {
        status,
      },
    });

    return evaluation;
  });

  res.json({
    message:
      status === "APPROVED"
        ? "Evaluation approved successfully"
        : "Evaluation rejected successfully",
    evaluation: reviewedEvaluation,
  });
});

module.exports = {
  createEvaluation,
  getEvaluations,
  getEvaluationById,
  updateEvaluation,
  reviewEvaluation,
};
