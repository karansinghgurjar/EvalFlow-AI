import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getEvaluationById,
  reviewEvaluation,
} from "../../api/evaluationApi";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import MetricCard from "../../components/common/MetricCard";
import PageHeader from "../../components/common/PageHeader";
import TextareaField from "../../components/common/TextareaField";
import { rejectReviewSchema } from "../../utils/reviewSchemas";

function ReviewDetailsPage() {
  const { evaluationId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["evaluations", evaluationId],
    queryFn: () => getEvaluationById(evaluationId),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(rejectReviewSchema),
    defaultValues: {
      reviewerFeedback: "",
    },
  });

  const reviewMutation = useMutation({
    mutationFn: (payload) => reviewEvaluation(evaluationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluations"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "reviewer"] });
      navigate("/evaluations/review");
    },
  });

  if (isLoading) {
    return <LoadingState message="Loading evaluation details..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Unable to load evaluation"
        message={error.response?.data?.message || "Please try again later."}
      />
    );
  }

  const evaluation = data.evaluation;
  const task = evaluation.task;
  const canReview = evaluation.status === "SUBMITTED";

  function handleApprove() {
    const confirmed = window.confirm(
      "Are you sure you want to approve this evaluation?"
    );

    if (!confirmed) return;

    reviewMutation.mutate({
      status: "APPROVED",
      reviewerFeedback: "Approved. Evaluation is aligned with the rubric.",
    });
  }

  function handleReject(values) {
    reviewMutation.mutate({
      status: "REJECTED",
      reviewerFeedback: values.reviewerFeedback,
    });
  }

  return (
    <div>
      <div className="mb-5">
        <Link
          to="/evaluations/review"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-950"
        >
          <ArrowLeft size={16} />
          Back to review queue
        </Link>
      </div>

      <PageHeader
        title="Review Evaluation"
        description="Check the annotator ratings, justification, and task context before approving or rejecting."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <Badge value={evaluation.status} />
        <Badge value={evaluation.issueType} />
        <Badge value={task?.difficulty} />
      </div>

      {reviewMutation.error ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {reviewMutation.error.response?.data?.message ||
            "Failed to review evaluation."}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Overall Score"
          value={evaluation.overallScore}
          description="Average of four rubric ratings"
          icon={CheckCircle}
        />

        <MetricCard
          title="Accuracy"
          value={`${evaluation.accuracy}/5`}
          description="Factual correctness"
          icon={CheckCircle}
        />

        <MetricCard
          title="Relevance"
          value={`${evaluation.relevance}/5`}
          description="Prompt alignment"
          icon={CheckCircle}
        />

        <MetricCard
          title="Safety"
          value={`${evaluation.safety}/5`}
          description="Safety and risk"
          icon={CheckCircle}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <h3 className="text-base font-semibold text-slate-950">Prompt</h3>
          <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
            {task?.prompt}
          </p>
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-slate-950">
            Model Response
          </h3>
          <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
            {task?.response}
          </p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <h3 className="text-base font-semibold text-slate-950">
            Annotator Evaluation
          </h3>

          <div className="mt-5 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
            <p>
              <span className="font-medium text-slate-950">Annotator:</span>{" "}
              {evaluation.annotator?.name || "—"}
            </p>

            <p>
              <span className="font-medium text-slate-950">Project:</span>{" "}
              {task?.project?.title || "—"}
            </p>

            <p>
              <span className="font-medium text-slate-950">Coherence:</span>{" "}
              {evaluation.coherence}/5
            </p>

            <p>
              <span className="font-medium text-slate-950">Issue type:</span>{" "}
              <Badge value={evaluation.issueType} />
            </p>
          </div>

          <h4 className="mt-6 text-sm font-semibold text-slate-950">
            Notes / Justification
          </h4>

          <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
            {evaluation.notes}
          </p>
        </Card>

        <Card>
          <h3 className="text-base font-semibold text-slate-950">
            Review Decision
          </h3>

          {!canReview ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              This evaluation has already been reviewed.
            </div>
          ) : (
            <div className="mt-5 space-y-5">
              <Button
                onClick={handleApprove}
                disabled={reviewMutation.isPending}
                className="w-full"
              >
                <CheckCircle size={16} />
                {reviewMutation.isPending ? "Approving..." : "Approve"}
              </Button>

              <form
                onSubmit={handleSubmit(handleReject)}
                className="space-y-4 border-t border-slate-200 pt-5"
              >
                <TextareaField
                  label="Reject Feedback"
                  name="reviewerFeedback"
                  register={register}
                  error={errors.reviewerFeedback}
                  placeholder="Explain what the annotator should improve before resubmitting."
                  rows={5}
                />

                <Button
                  type="submit"
                  variant="danger"
                  disabled={reviewMutation.isPending}
                  className="w-full"
                >
                  <XCircle size={16} />
                  {reviewMutation.isPending
                    ? "Rejecting..."
                    : "Reject with Feedback"}
                </Button>
              </form>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default ReviewDetailsPage;
