import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { evaluationSchema } from "../../utils/evaluationSchemas";
import Button from "../common/Button";
import RatingField from "../common/RatingField";
import SelectField from "../common/SelectField";
import TextareaField from "../common/TextareaField";

const issueTypeOptions = [
  { label: "None", value: "NONE" },
  { label: "Hallucination", value: "HALLUCINATION" },
  { label: "Unsafe", value: "UNSAFE" },
  { label: "Irrelevant", value: "IRRELEVANT" },
  { label: "Incomplete", value: "INCOMPLETE" },
  { label: "Bias", value: "BIAS" },
  { label: "Other", value: "OTHER" },
];

function EvaluationForm({
  defaultValues,
  onSaveDraft,
  onSubmitFinal,
  isSaving,
  isSubmittingFinal,
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(evaluationSchema),
    defaultValues: defaultValues || {
      accuracy: 5,
      relevance: 5,
      coherence: 5,
      safety: 5,
      issueType: "NONE",
      notes: "",
    },
  });

  function buildPayload(values, status) {
    return {
      accuracy: Number(values.accuracy),
      relevance: Number(values.relevance),
      coherence: Number(values.coherence),
      safety: Number(values.safety),
      issueType: values.issueType,
      notes: values.notes,
      status,
    };
  }

  const handleDraft = handleSubmit((values) => {
    onSaveDraft(buildPayload(values, "DRAFT"));
  });

  const handleFinalSubmit = handleSubmit((values) => {
    onSubmitFinal(buildPayload(values, "SUBMITTED"));
  });

  return (
    <form className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <RatingField
          label="Accuracy"
          name="accuracy"
          register={register}
          control={control}
          error={errors.accuracy}
        />

        <RatingField
          label="Relevance"
          name="relevance"
          register={register}
          control={control}
          error={errors.relevance}
        />

        <RatingField
          label="Coherence"
          name="coherence"
          register={register}
          control={control}
          error={errors.coherence}
        />

        <RatingField
          label="Safety"
          name="safety"
          register={register}
          control={control}
          error={errors.safety}
        />
      </div>

      <SelectField
        label="Issue Type"
        name="issueType"
        register={register}
        error={errors.issueType}
        options={issueTypeOptions}
      />

      <TextareaField
        label="Notes / Justification"
        name="notes"
        register={register}
        error={errors.notes}
        placeholder="Explain why you gave these ratings. Mention any hallucination, incompleteness, safety issue, or quality concern."
        rows={6}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="secondary"
          onClick={handleDraft}
          disabled={isSaving || isSubmittingFinal}
          className="flex-1"
        >
          {isSaving ? "Saving Draft..." : "Save Draft"}
        </Button>

        <Button
          type="button"
          onClick={handleFinalSubmit}
          disabled={isSaving || isSubmittingFinal}
          className="flex-1"
        >
          {isSubmittingFinal ? "Submitting..." : "Submit Evaluation"}
        </Button>
      </div>
    </form>
  );
}

export default EvaluationForm;
