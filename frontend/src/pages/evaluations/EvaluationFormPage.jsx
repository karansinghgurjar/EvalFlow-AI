import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { createEvaluation, updateEvaluation } from "../../api/evaluationApi";
import { getTaskById } from "../../api/taskApi";
import Badge from "../../components/common/Badge";
import Card from "../../components/common/Card";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import PageHeader from "../../components/common/PageHeader";
import EvaluationForm from "../../components/evaluations/EvaluationForm";

function EvaluationFormPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks", taskId],
    queryFn: () => getTaskById(taskId),
  });

  const createMutation = useMutation({
    mutationFn: createEvaluation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "annotator"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ evaluationId, payload }) =>
      updateEvaluation(evaluationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "annotator"] });
    },
  });

  if (isLoading) {
    return <LoadingState message="Loading evaluation task..." />;
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
  const existingEvaluation = task.evaluation;

  const cannotEdit =
    existingEvaluation &&
    !["DRAFT", "REJECTED"].includes(existingEvaluation.status);

  const defaultValues = existingEvaluation
    ? {
        accuracy: existingEvaluation.accuracy,
        relevance: existingEvaluation.relevance,
        coherence: existingEvaluation.coherence,
        safety: existingEvaluation.safety,
        issueType: existingEvaluation.issueType || "NONE",
        notes: existingEvaluation.notes || "",
      }
    : {
        accuracy: 5,
        relevance: 5,
        coherence: 5,
        safety: 5,
        issueType: "NONE",
        notes: "",
      };

  function saveEvaluation(payload) {
    const finalPayload = {
      ...payload,
      taskId,
    };

    if (existingEvaluation) {
      updateMutation.mutate({
        evaluationId: existingEvaluation.id,
        payload,
      });
    } else {
      createMutation.mutate(finalPayload);
    }
  }

  function submitEvaluation(payload) {
    const finalPayload = {
      ...payload,
      taskId,
    };

    const mutationOptions = {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard", "annotator"] });
        navigate("/tasks");
      },
    };

    if (existingEvaluation) {
      updateMutation.mutate(
        {
          evaluationId: existingEvaluation.id,
          payload,
        },
        mutationOptions
      );
    } else {
      createMutation.mutate(finalPayload, mutationOptions);
    }
  }

  const mutationError = createMutation.error || updateMutation.error;
  const showSuccess =
    !createMutation.isPending &&
    !updateMutation.isPending &&
    (createMutation.isSuccess || updateMutation.isSuccess);

  return (
    <div>
      <div className="mb-5">
        <Link
          to={`/tasks/${taskId}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-950"
        >
          <ArrowLeft size={16} />
          Back to task
        </Link>
      </div>

      <PageHeader
        title="Evaluate Task"
        description="Rate the model response using the evaluation rubric and submit your justification."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <Badge value={task.status} />
        <Badge value={task.difficulty} />
        {existingEvaluation ? <Badge value={existingEvaluation.status} /> : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
        <div className="space-y-6">
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

          {existingEvaluation?.reviewerFeedback ? (
            <Card>
              <h3 className="text-base font-semibold text-red-700">
                Reviewer Feedback
              </h3>
              <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-red-50 p-4 text-sm leading-7 text-red-700">
                {existingEvaluation.reviewerFeedback}
              </p>
            </Card>
          ) : null}
        </div>

        <Card>
          <h3 className="mb-5 text-lg font-semibold text-slate-950">
            Evaluation Rubric
          </h3>

          {cannotEdit ? (
            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-sm text-yellow-800">
              This evaluation has already been submitted or reviewed and cannot
              be edited.
            </div>
          ) : (
            <>
              {mutationError ? (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {mutationError.response?.data?.message ||
                    "Failed to save evaluation."}
                </div>
              ) : null}

              {showSuccess ? (
                <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  Evaluation saved successfully.
                </div>
              ) : null}

              <EvaluationForm
                defaultValues={defaultValues}
                onSaveDraft={saveEvaluation}
                onSubmitFinal={submitEvaluation}
                isSaving={createMutation.isPending || updateMutation.isPending}
                isSubmittingFinal={
                  createMutation.isPending || updateMutation.isPending
                }
              />
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export default EvaluationFormPage;
