// Generic quantity input enforcing a minimum value of 1 and optional max.
// Calls onChange with a safe integer value.
import toast from 'react-hot-toast';

export function QuantityInput({ value, onChange, max, className = '' }) {
  const handleChange = (event) => {
    const raw = event.target.value;
    const parsed = parseInt(raw, 10);

    if (Number.isNaN(parsed) || parsed < 1) {
      // If user tries to type 0 or empty, immediately reset to 1
      onChange(1);
      return;
    }

    if (typeof max === 'number' && max > 0 && parsed > max) {
      toast.error(`Максимальное количество для этой розы: ${max}`);
      onChange(max);
      return;
    }

    onChange(parsed);
  };

  return (
    <input
      type="number"
      min={1}
      value={value}
      onChange={handleChange}
      className={`w-16 rounded border border-slate-300 px-2 py-1 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
    />
  );
}

