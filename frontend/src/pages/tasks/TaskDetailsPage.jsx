import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle, ClipboardList, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { getTaskById } from "../../api/taskApi";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import MetricCard from "../../components/common/MetricCard";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { formatDate, formatDateTime } from "../../utils/formatters";

function TaskDetailsPage() {
  const { taskId } = useParams();
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks", taskId],
    queryFn: () => getTaskById(taskId),
  });

  if (isLoading) {
    return <LoadingState message="Loading task details..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load task"
        message={error.response?.data?.message || "Please try again later."}
      />
    );
  }

  const task = data.task;
  const evaluation = task.evaluation;
  const canEvaluate =
    user?.role === "ANNOTATOR" &&
    task.assignedTo?.id === user.id &&
    (!evaluation || ["DRAFT", "REJECTED"].includes(evaluation.status));

  return (
    <div>
      <div className="mb-5">
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-950"
        >
          <ArrowLeft size={16} />
          Back to tasks
        </Link>
      </div>

      <PageHeader
        title="Task Details"
        description="Review the prompt, model response, assignment, and evaluation status."
        action={
          canEvaluate ? (
            <Link to={`/tasks/${task.id}/evaluate`}>
              <Button>
                {evaluation?.status === "REJECTED"
                  ? "Revise Evaluation"
                  : evaluation?.status === "DRAFT"
                    ? "Continue Draft"
                    : "Evaluate Task"}
              </Button>
            </Link>
          ) : null
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <Badge value={task.status} />
        <Badge value={task.difficulty} />
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {task.category}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Task Status"
          value={task.status?.replace("_", " ")}
          description="Current workflow stage"
          icon={ClipboardList}
        />

        <MetricCard
          title="Difficulty"
          value={task.difficulty}
          description="Assessment complexity"
          icon={ClipboardList}
        />

        <MetricCard
          title="Score"
          value={evaluation?.overallScore ?? "—"}
          description="Evaluation score"
          icon={Star}
        />

        <MetricCard
          title="Evaluation"
          value={evaluation?.status || "Not Started"}
          description="Submission status"
          icon={CheckCircle}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <h3 className="text-base font-semibold text-slate-950">Prompt</h3>
          <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
            {task.prompt}
          </p>
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-slate-950">
            Model Response
          </h3>
          <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
            {task.response}
          </p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <h3 className="text-base font-semibold text-slate-950">
            Assignment Details
          </h3>

          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <p>
              <span className="font-medium text-slate-950">Project:</span>{" "}
              {task.project?.title || "—"}
            </p>

            <p>
              <span className="font-medium text-slate-950">Domain:</span>{" "}
              {task.project?.domain || "—"}
            </p>

            <p>
              <span className="font-medium text-slate-950">Assignee:</span>{" "}
              {task.assignedTo?.name || "Unassigned"}
            </p>

            <p>
              <span className="font-medium text-slate-950">Due date:</span>{" "}
              {formatDate(task.dueDate)}
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-slate-950">
            Evaluation Details
          </h3>

          {!evaluation ? (
            <p className="mt-5 text-sm text-slate-500">
              No evaluation has been submitted for this task yet.
            </p>
          ) : (
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-950">Status:</span>{" "}
                <Badge value={evaluation.status} />
              </p>

              <p>
                <span className="font-medium text-slate-950">Issue type:</span>{" "}
                <Badge value={evaluation.issueType} />
              </p>

              <p>
                <span className="font-medium text-slate-950">Accuracy:</span>{" "}
                {evaluation.accuracy}/5
              </p>

              <p>
                <span className="font-medium text-slate-950">Relevance:</span>{" "}
                {evaluation.relevance}/5
              </p>

              <p>
                <span className="font-medium text-slate-950">Coherence:</span>{" "}
                {evaluation.coherence}/5
              </p>

              <p>
                <span className="font-medium text-slate-950">Safety:</span>{" "}
                {evaluation.safety}/5
              </p>

              <p>
                <span className="font-medium text-slate-950">Submitted by:</span>{" "}
                {evaluation.annotator?.name || "—"}
              </p>

              <p>
                <span className="font-medium text-slate-950">Reviewed by:</span>{" "}
                {evaluation.reviewer?.name || "Not reviewed"}
              </p>

              <p>
                <span className="font-medium text-slate-950">Reviewed at:</span>{" "}
                {formatDateTime(evaluation.reviewedAt)}
              </p>
            </div>
          )}
        </Card>
      </div>

      {evaluation ? (
        <Card className="mt-6">
          <h3 className="text-base font-semibold text-slate-950">
            Annotator Notes
          </h3>

          <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
            {evaluation.notes}
          </p>

          {evaluation.reviewerFeedback ? (
            <>
              <h3 className="mt-6 text-base font-semibold text-slate-950">
                Reviewer Feedback
              </h3>

              <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-red-50 p-4 text-sm leading-7 text-red-700">
                {evaluation.reviewerFeedback}
              </p>
            </>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}

export default TaskDetailsPage;
