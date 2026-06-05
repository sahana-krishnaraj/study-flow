"use client";

import { useTransition } from "react";
import type { Assignment } from "@/generated/prisma/client";
import {
  cycleAssignmentStatus,
  deleteAssignment,
} from "@/lib/actions";
import {
  formatDate,
  isOverdue,
  priorityColor,
  STATUS_LABELS,
  statusColor,
  PRIORITY_LABELS,
} from "@/lib/utils";

interface AssignmentCardProps {
  assignment: Assignment;
  onEdit: (assignment: Assignment) => void;
  completed?: boolean;
}

export function AssignmentCard({
  assignment,
  onEdit,
  completed = false,
}: AssignmentCardProps) {
  const [isPending, startTransition] = useTransition();
  const overdue = isOverdue(assignment.dueDate, assignment.status);

  function handleStatusClick() {
    startTransition(async () => {
      await cycleAssignmentStatus(assignment.id);
    });
  }

  function handleDelete() {
    if (!confirm("Delete this assignment?")) return;
    startTransition(async () => {
      await deleteAssignment(assignment.id);
    });
  }

  return (
    <article
      className={`rounded-xl border bg-white p-4 shadow-sm transition ${
        overdue
          ? "border-red-300 bg-red-50/50"
          : completed
            ? "border-slate-200 opacity-75"
            : "border-slate-200 hover:border-slate-300"
      } ${isPending ? "opacity-60" : ""}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {overdue && (
              <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                Overdue
              </span>
            )}
            <h3
              className={`text-base font-semibold text-slate-900 ${
                completed ? "line-through text-slate-500" : ""
              }`}
            >
              {assignment.title}
            </h3>
          </div>
          <p className="mt-1 text-sm text-slate-600">{assignment.className}</p>
          {assignment.notes && (
            <p className="mt-2 text-sm text-slate-500">{assignment.notes}</p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <p
            className={`text-sm font-medium ${
              overdue ? "text-red-700" : "text-slate-700"
            }`}
          >
            Due {formatDate(assignment.dueDate)}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span
              className={`rounded-full border px-2 py-0.5 text-xs font-medium ${priorityColor(assignment.priority)}`}
            >
              {PRIORITY_LABELS[assignment.priority]}
            </span>
            <button
              onClick={handleStatusClick}
              disabled={isPending}
              title="Click to update status"
              className={`rounded-full border px-2 py-0.5 text-xs font-medium transition hover:opacity-80 ${statusColor(assignment.status)}`}
            >
              {STATUS_LABELS[assignment.status]}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
        <button
          onClick={() => onEdit(assignment)}
          className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-sm font-medium text-red-600 transition hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
