"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLogout } from "~/hooks/useQueries";

export type HeaderProps = Readonly<{
  name: string;
}>;

export const HeaderDashboard = ({ name }: HeaderProps) => {
  const router = useRouter();
  const logoutMutation = useLogout();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Menu Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Abrir menu"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Center - Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#4caf50] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                ByteBank
              </span>
            </Link>

            {/* Right - User Info */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600 hidden md:block">
                {name}
              </span>
              <div className="w-10 h-10 rounded-full bg-[#c8e6c9] flex items-center justify-center text-[#4caf50] font-semibold text-sm">
                {name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Modal */}
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 border-r border-gray-100">
            <div className="p-6">
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="mb-8 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="Fechar menu"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* User Info */}
              <div className="mb-8 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#c8e6c9] flex items-center justify-center text-[#4caf50] font-semibold text-lg">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{name}</p>
                    <p className="text-sm text-gray-500">Ver perfil</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsModalOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#e8f5e9] text-gray-700 hover:text-[#4caf50] transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Início
                  </Link>
                </li>

                <li>
                  <Link
                    href="/investimentos"
                    onClick={() => setIsModalOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#e8f5e9] text-gray-700 hover:text-[#4caf50] transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    Investimentos
                  </Link>
                </li>
              </ul>

              {/* Logout Button */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  {logoutMutation.isPending ? "Saindo..." : "Sair"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
