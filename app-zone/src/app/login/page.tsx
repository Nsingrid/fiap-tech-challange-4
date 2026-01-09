import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { LoginForm } from "~/components/login-form/login-form";

export const metadata = {
  title: "Login - FinApp",
  description: "Faça login ou crie sua conta no FinApp",
};

export default async function LoginPage() {
  // Se já está autenticado, redireciona para dashboard
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (token) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
