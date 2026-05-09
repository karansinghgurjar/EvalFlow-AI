import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { projectSchema } from "../../utils/projectSchemas";
import Button from "../common/Button";
import FormField from "../common/FormField";
import SelectField from "../common/SelectField";
import TextareaField from "../common/TextareaField";

const statusOptions = [
  { label: "Draft", value: "DRAFT" },
  { label: "Active", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Archived", value: "ARCHIVED" },
];

function ProjectForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = "Save Project",
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      domain: "General",
      status: "ACTIVE",
      deadline: "",
    },
  });

  function handleFormSubmit(values) {
    const payload = {
      ...values,
      deadline: values.deadline
        ? new Date(values.deadline).toISOString()
        : undefined,
    };

    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <FormField
        label="Project title"
        name="title"
        register={register}
        error={errors.title}
        placeholder="General LLM Response Quality Evaluation"
      />

      <TextareaField
        label="Description"
        name="description"
        register={register}
        error={errors.description}
        placeholder="Describe the purpose of this evaluation project."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Domain"
          name="domain"
          register={register}
          error={errors.domain}
          placeholder="General, Coding, Safety..."
        />

        <SelectField
          label="Status"
          name="status"
          register={register}
          error={errors.status}
          options={statusOptions}
        />
      </div>

      <FormField
        label="Deadline"
        name="deadline"
        type="date"
        register={register}
        error={errors.deadline}
      />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

export default ProjectForm;
