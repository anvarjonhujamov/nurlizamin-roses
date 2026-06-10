import { categories } from '../utils/filtering.js';

export function CatalogFilters({ filters, onChange, categories: categoriesProp }) {
  const categoriesToUse = categoriesProp ?? categories;
  const handleCategoryChange = (value) => {
    const nextCategory = value === 'all' ? 'all' : value;
    onChange({ ...filters, category: nextCategory });
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:flex-row md:items-center md:justify-between md:p-4">
      <div className="space-y-1">
        <p className="text-xs text-slate-500">
          Filter by category or search by name.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:justify-end">
        <div className="relative flex-1 md:max-w-xs">
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search by variety name…"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <select
          value={filters.category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 md:w-44"
        >
          <option value="all">All categories</option>
          {categoriesToUse.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nameRu}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}


