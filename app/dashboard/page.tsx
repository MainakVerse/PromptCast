import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/"); // redirect if no session or user
  }

  // We assert that session.user is defined using "!"
  return <DashboardClient user={session.user!} />;
}
