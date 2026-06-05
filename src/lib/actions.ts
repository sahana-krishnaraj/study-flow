"use server";

import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { auth, signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { AssignmentStatus, Priority } from "@/generated/prisma/client";

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

export async function createAssignment(formData: FormData) {
  const userId = await requireUserId();

  const title = (formData.get("title") as string)?.trim();
  const className = (formData.get("className") as string)?.trim();
  const dueDate = formData.get("dueDate") as string;
  const priority = formData.get("priority") as Priority;
  const notes = (formData.get("notes") as string)?.trim() || null;

  if (!title || !className || !dueDate) {
    return { error: "Title, class, and due date are required." };
  }

  await prisma.assignment.create({
    data: {
      userId,
      title,
      className,
      dueDate: new Date(dueDate),
      priority: priority || "MEDIUM",
      notes,
    },
  });

  revalidatePath("/");
  return { success: true };
}

export async function updateAssignment(id: string, formData: FormData) {
  const userId = await requireUserId();

  const existing = await prisma.assignment.findFirst({
    where: { id, userId },
  });
  if (!existing) {
    return { error: "Assignment not found." };
  }

  const title = (formData.get("title") as string)?.trim();
  const className = (formData.get("className") as string)?.trim();
  const dueDate = formData.get("dueDate") as string;
  const priority = formData.get("priority") as Priority;
  const status = formData.get("status") as AssignmentStatus;
  const notes = (formData.get("notes") as string)?.trim() || null;

  if (!title || !className || !dueDate) {
    return { error: "Title, class, and due date are required." };
  }

  await prisma.assignment.update({
    where: { id },
    data: {
      title,
      className,
      dueDate: new Date(dueDate),
      priority: priority || existing.priority,
      status: status || existing.status,
      notes,
    },
  });

  revalidatePath("/");
  return { success: true };
}

export async function deleteAssignment(id: string) {
  const userId = await requireUserId();

  const existing = await prisma.assignment.findFirst({
    where: { id, userId },
  });
  if (!existing) {
    return { error: "Assignment not found." };
  }

  await prisma.assignment.delete({ where: { id } });
  revalidatePath("/");
  return { success: true };
}

export async function cycleAssignmentStatus(id: string) {
  const userId = await requireUserId();

  const assignment = await prisma.assignment.findFirst({
    where: { id, userId },
  });
  if (!assignment) {
    return { error: "Assignment not found." };
  }

  const cycle: AssignmentStatus[] = ["NOT_STARTED", "IN_PROGRESS", "COMPLETE"];
  const currentIndex = cycle.indexOf(assignment.status);
  const nextStatus = cycle[(currentIndex + 1) % cycle.length];

  await prisma.assignment.update({
    where: { id },
    data: { status: nextStatus },
  });

  revalidatePath("/");
  return { success: true, status: nextStatus };
}

export async function setAssignmentStatus(id: string, status: AssignmentStatus) {
  const userId = await requireUserId();

  const existing = await prisma.assignment.findFirst({
    where: { id, userId },
  });
  if (!existing) {
    return { error: "Assignment not found." };
  }

  await prisma.assignment.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/");
  return { success: true };
}

export async function signUp(data: {
  name: string;
  email: string;
  password: string;
}) {
  const name = data.name?.trim();
  const email = data.email?.trim().toLowerCase();
  const password = data.password;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return {
      error: existing.password
        ? "An account with this email already exists."
        : "This email is already linked to Google. Sign in with Google instead.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name: name || null,
      email,
      password: hashedPassword,
    },
  });

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof AuthError) {
      return { error: "Account created but sign-in failed. Please log in." };
    }
    throw error;
  }
}
