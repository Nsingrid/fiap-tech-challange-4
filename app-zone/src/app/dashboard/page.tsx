import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardMain } from "~/components/dashboard-main/dashboard-main";
import { HeaderDashboard } from "~/components/header-dashboard/header-dashboard";
import { SetTokenClient } from "~/components/set-token-client/set-token-client";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  const username = cookieStore.get("username")?.value;

  // Proteção adicional: se não tiver token, redireciona para login
  if (!token) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-white">
      <SetTokenClient token={token} />
      <HeaderDashboard name={username ?? "Usuário"} />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <DashboardMain />
      </main>
    </div>
  );
}
