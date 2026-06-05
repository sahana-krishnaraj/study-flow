"use client";

import { useMemo, useState } from "react";
import type { Assignment } from "@/generated/prisma/client";
import { AssignmentCard } from "@/components/AssignmentCard";
import { AssignmentForm } from "@/components/AssignmentForm";
import { FilterBar, type Filters } from "@/components/FilterBar";
import { StatsBar } from "@/components/StatsBar";
import { isDueThisWeek, isOverdue } from "@/lib/utils";

interface AssignmentDashboardProps {
  assignments: Assignment[];
}

export function AssignmentDashboard({ assignments }: AssignmentDashboardProps) {
  const [filters, setFilters] = useState<Filters>({
    className: "",
    priority: "",
    status: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null,
  );

  const stats = useMemo(
    () => ({
      dueThisWeek: assignments.filter((a) =>
        isDueThisWeek(a.dueDate, a.status),
      ).length,
      overdue: assignments.filter((a) => isOverdue(a.dueDate, a.status)).length,
      completed: assignments.filter((a) => a.status === "COMPLETE").length,
    }),
    [assignments],
  );

  const classes = useMemo(
    () => [...new Set(assignments.map((a) => a.className))].sort(),
    [assignments],
  );

  const filtered = useMemo(() => {
    return assignments.filter((a) => {
      if (filters.className && a.className !== filters.className) return false;
      if (filters.priority && a.priority !== filters.priority) return false;
      if (filters.status && a.status !== filters.status) return false;
      return true;
    });
  }, [assignments, filters]);

  const active = useMemo(() => {
    return filtered
      .filter((a) => a.status !== "COMPLETE")
      .sort((a, b) => {
        const aOverdue = isOverdue(a.dueDate, a.status);
        const bOverdue = isOverdue(b.dueDate, b.status);
        if (aOverdue && !bOverdue) return -1;
        if (!aOverdue && bOverdue) return 1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  }, [filtered]);

  const completed = useMemo(() => {
    return filtered
      .filter((a) => a.status === "COMPLETE")
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      );
  }, [filtered]);

  function handleEdit(assignment: Assignment) {
    setEditingAssignment(assignment);
    setShowForm(true);
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingAssignment(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Assignments</h1>
          <p className="text-sm text-slate-500">
            Track due dates, priorities, and progress in one place.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingAssignment(null);
            setShowForm(true);
          }}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          + New assignment
        </button>
      </div>

      <StatsBar {...stats} />

      <FilterBar filters={filters} classes={classes} onChange={setFilters} />

      {active.length === 0 && completed.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="text-slate-600">
            {assignments.length === 0
              ? "No assignments yet. Add your first one to get started!"
              : "No assignments match your filters."}
          </p>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <section className="space-y-3">
              {active.some((a) => isOverdue(a.dueDate, a.status)) && (
                <h2 className="text-sm font-semibold uppercase tracking-wide text-red-600">
                  Overdue & upcoming
                </h2>
              )}
              {active.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onEdit={handleEdit}
                />
              ))}
            </section>
          )}

          {completed.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Completed
              </h2>
              {completed.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onEdit={handleEdit}
                  completed
                />
              ))}
            </section>
          )}
        </>
      )}

      {showForm && (
        <AssignmentForm assignment={editingAssignment} onClose={handleCloseForm} />
      )}
    </div>
  );
}
