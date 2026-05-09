function TextareaField({
  label,
  name,
  register,
  error,
  placeholder,
  rows = 4,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        {...register(name)}
        className={`w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition ${
          error
            ? "border-red-300 bg-red-50 focus:border-red-500"
            : "border-slate-200 bg-white focus:border-slate-950"
        }`}
      />

      {error ? (
        <p className="mt-1.5 text-sm text-red-600">{error.message}</p>
      ) : null}
    </div>
  );
}

export default TextareaField;
