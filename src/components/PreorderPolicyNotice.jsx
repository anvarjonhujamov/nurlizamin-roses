import { PREORDER_POLICY } from '../lib/orderPolicy.js';

export function PreorderPolicyNotice() {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50/80 p-4 text-xs leading-relaxed text-red-700 sm:text-sm">
      <p className="font-semibold text-red-800">{PREORDER_POLICY.uz.title}</p>
      <ul className="mt-1.5 list-disc space-y-1 pl-4">
        {PREORDER_POLICY.uz.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <p className="mt-3 font-semibold text-red-800">{PREORDER_POLICY.ru.title}</p>
      <ul className="mt-1.5 list-disc space-y-1 pl-4">
        {PREORDER_POLICY.ru.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
