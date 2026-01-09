import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { HeaderDashboard } from "~/components/header-dashboard/header-dashboard";
import { InvestmentMain } from "~/components/investment-main/investment-main";
import { SetTokenClient } from "~/components/set-token-client/set-token-client";

export default async function Investimentos() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;
  const username = cookieStore.get("username")?.value;

  // Proteção adicional: se não tiver token, redireciona para login
  if (!token) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SetTokenClient token={token} />
      <HeaderDashboard name={username ?? "Usuário"} />
      <InvestmentMain />
    </div>
  );
}
