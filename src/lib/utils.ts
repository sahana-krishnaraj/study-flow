import type { AssignmentStatus, Priority } from "@/generated/prisma/client";

export const PRIORITY_LABELS: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const STATUS_LABELS: Record<AssignmentStatus, string> = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "In progress",
  COMPLETE: "Complete",
};

export const STATUS_CYCLE: AssignmentStatus[] = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETE",
];

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? 0 : 7 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

export function isOverdue(dueDate: Date | string, status: AssignmentStatus): boolean {
  if (status === "COMPLETE") return false;
  return startOfDay(new Date(dueDate)) < startOfDay(new Date());
}

export function isDueThisWeek(dueDate: Date | string, status: AssignmentStatus): boolean {
  if (status === "COMPLETE") return false;
  const due = startOfDay(new Date(dueDate));
  const now = new Date();
  return due >= startOfDay(now) && due <= endOfWeek(now);
}

export function priorityColor(priority: Priority): string {
  switch (priority) {
    case "HIGH":
      return "bg-red-100 text-red-800 border-red-200";
    case "MEDIUM":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "LOW":
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export function statusColor(status: AssignmentStatus): string {
  switch (status) {
    case "COMPLETE":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "NOT_STARTED":
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}
