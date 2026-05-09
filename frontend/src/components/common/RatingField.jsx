import { useWatch } from "react-hook-form";

function RatingField({ label, name, register, error, control }) {
  const selectedValue = useWatch({
    control,
    name,
  });

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((rating) => {
          const isSelected = Number(selectedValue) === rating;

          return (
            <label
              key={rating}
              className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-sm font-medium transition ${
                isSelected
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                value={rating}
                {...register(name)}
                className="sr-only"
              />

              {rating}
            </label>
          );
        })}
      </div>

      {error ? (
        <p className="mt-1.5 text-sm text-red-600">{error.message}</p>
      ) : null}
    </div>
  );
}

export default RatingField;
