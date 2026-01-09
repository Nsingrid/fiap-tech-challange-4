import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "~/stores/useUserStore";

/**
 * Hook para gerenciar autenticação
 * Redireciona automaticamente para login se não autenticado
 */
export function useAuth() {
  const router = useRouter();
  const { username, token, email, loading, error, login, logout, clearUser } =
    useUserStore();

  const isAuthenticated = !!token && !!username;

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  }, [logout, router]);

  useEffect(() => {
    // Verificar autenticação no cliente
    if (!isAuthenticated && typeof window !== "undefined") {
      // Só redireciona se não estiver em rota pública
      const publicRoutes = ["/login", "/"];
      if (!publicRoutes.includes(window.location.pathname)) {
        router.push("/login");
      }
    }
  }, [isAuthenticated, router]);

  return {
    isAuthenticated,
    username,
    token,
    email,
    loading,
    error,
    login,
    logout: handleLogout,
    clearUser,
  };
}
