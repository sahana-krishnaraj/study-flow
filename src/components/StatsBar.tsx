interface StatsBarProps {
  dueThisWeek: number;
  overdue: number;
  completed: number;
}

export function StatsBar({ dueThisWeek, overdue, completed }: StatsBarProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
        <p className="text-2xl font-bold text-blue-700">{dueThisWeek}</p>
        <p className="text-sm text-blue-600">Due this week</p>
      </div>
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
        <p className="text-2xl font-bold text-red-700">{overdue}</p>
        <p className="text-sm text-red-600">Overdue</p>
      </div>
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <p className="text-2xl font-bold text-emerald-700">{completed}</p>
        <p className="text-sm text-emerald-600">Completed</p>
      </div>
    </div>
  );
}
