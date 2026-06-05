"use client";

import type { AssignmentStatus, Priority } from "@/generated/prisma/client";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/lib/utils";

export interface Filters {
  className: string;
  priority: Priority | "";
  status: AssignmentStatus | "";
}

interface FilterBarProps {
  filters: Filters;
  classes: string[];
  onChange: (filters: Filters) => void;
}

export function FilterBar({ filters, classes, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={filters.className}
        onChange={(e) => onChange({ ...filters, className: e.target.value })}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">All classes</option>
        {classes.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={filters.priority}
        onChange={(e) =>
          onChange({ ...filters, priority: e.target.value as Priority | "" })
        }
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">All priorities</option>
        {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
          <option key={p} value={p}>
            {PRIORITY_LABELS[p]}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) =>
          onChange({ ...filters, status: e.target.value as AssignmentStatus | "" })
        }
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
      >
        <option value="">All statuses</option>
        {(Object.keys(STATUS_LABELS) as AssignmentStatus[]).map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>

      {(filters.className || filters.priority || filters.status) && (
        <button
          onClick={() =>
            onChange({ className: "", priority: "", status: "" })
          }
          className="rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
