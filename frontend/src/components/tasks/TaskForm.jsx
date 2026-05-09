import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { taskSchema } from "../../utils/taskSchemas";
import Button from "../common/Button";
import FormField from "../common/FormField";
import SelectField from "../common/SelectField";
import TextareaField from "../common/TextareaField";

const difficultyOptions = [
  { label: "Easy", value: "EASY" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Hard", value: "HARD" },
];

function TaskForm({
  projects = [],
  annotators = [],
  onSubmit,
  isSubmitting,
  submitLabel = "Create Task",
}) {
  const projectOptions = [
    { label: "Select project", value: "" },
    ...projects.map((project) => ({
      label: project.title,
      value: project.id,
    })),
  ];

  const annotatorOptions = [
    { label: "Unassigned", value: "" },
    ...annotators.map((annotator) => ({
      label: `${annotator.name} (${annotator.email})`,
      value: annotator.id,
    })),
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      projectId: "",
      prompt: "",
      response: "",
      category: "General",
      difficulty: "MEDIUM",
      assignedToId: "",
      dueDate: "",
    },
  });

  function handleFormSubmit(values) {
    const payload = {
      projectId: values.projectId,
      prompt: values.prompt,
      response: values.response,
      category: values.category,
      difficulty: values.difficulty,
      assignedToId: values.assignedToId || null,
      dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : null,
    };

    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <SelectField
        label="Project"
        name="projectId"
        register={register}
        error={errors.projectId}
        options={projectOptions}
      />

      <TextareaField
        label="Prompt"
        name="prompt"
        register={register}
        error={errors.prompt}
        placeholder="Enter the user prompt that needs evaluation."
        rows={4}
      />

      <TextareaField
        label="Model Response"
        name="response"
        register={register}
        error={errors.response}
        placeholder="Enter the model response that annotators will evaluate."
        rows={5}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Category"
          name="category"
          register={register}
          error={errors.category}
          placeholder="Prompt Engineering, Coding, Safety..."
        />

        <SelectField
          label="Difficulty"
          name="difficulty"
          register={register}
          error={errors.difficulty}
          options={difficultyOptions}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Assign to"
          name="assignedToId"
          register={register}
          error={errors.assignedToId}
          options={annotatorOptions}
        />

        <FormField
          label="Due date"
          name="dueDate"
          type="date"
          register={register}
          error={errors.dueDate}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

export default TaskForm;
