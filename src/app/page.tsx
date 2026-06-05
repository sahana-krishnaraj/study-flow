import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { AssignmentDashboard } from "@/components/AssignmentDashboard";

export default async function HomePage() {
  const session = await auth();
  const userId = session!.user!.id;

  const assignments = await prisma.assignment.findMany({
    where: { userId },
    orderBy: { dueDate: "asc" },
  });

  return (
    <>
      <Navbar userName={session!.user!.name} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <AssignmentDashboard assignments={assignments} />
      </main>
    </>
  );
}
