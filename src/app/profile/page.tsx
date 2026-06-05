import { auth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";

export default async function ProfilePage() {
  const session = await auth();
  const user = session!.user!;

  return (
    <>
      <Navbar userName={user.name} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <div className="max-w-lg">
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Your account details</p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-slate-500">Name</dt>
                <dd className="mt-1 text-base text-slate-900">
                  {user.name || "Not set"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Email</dt>
                <dd className="mt-1 text-base text-slate-900">{user.email}</dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </>
  );
}
