"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

interface NavbarProps {
  userName?: string | null;
}

export function Navbar({ userName }: NavbarProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            S
          </span>
          <span className="text-lg font-semibold text-slate-900">StudyFlow</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="font-medium text-slate-600 transition hover:text-indigo-600"
          >
            Assignments
          </Link>
          <Link
            href="/profile"
            className="font-medium text-slate-600 transition hover:text-indigo-600"
          >
            Profile
          </Link>
          {userName && (
            <span className="hidden text-slate-500 sm:inline">Hi, {userName}</span>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Log out
          </button>
        </nav>
      </div>
    </header>
  );
}
