function SelectField({
  label,
  name,
  register,
  error,
  options = [],
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <select
        id={name}
        {...register(name)}
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
          error
            ? "border-red-300 bg-red-50 focus:border-red-500"
            : "border-slate-200 bg-white focus:border-slate-950"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className="mt-1.5 text-sm text-red-600">{error.message}</p>
      ) : null}
    </div>
  );
}

export default SelectField;
