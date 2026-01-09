"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLogin, useSignup } from "~/hooks/useQueries";

type LoginMode = "login" | "signup";

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  
  const [mode, setMode] = useState<LoginMode>("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
    rememberMe: false,
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loading = loginMutation.isPending || signupMutation.isPending;

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
      setLocalError(null);
    },
    []
  );

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setLocalError("Email e senha são obrigatórios");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLocalError("Email inválido");
      return false;
    }

    if (formData.password.length < 6) {
      setLocalError("Senha deve ter pelo menos 6 caracteres");
      return false;
    }

    if (mode === "signup") {
      if (!formData.username) {
        setLocalError("Nome de usuário é obrigatório");
        return false;
      }

      if (formData.username.length < 3) {
        setLocalError("Nome de usuário deve ter pelo menos 3 caracteres");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setLocalError("Senhas não conferem");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    try {
      if (mode === "login") {
        await loginMutation.mutateAsync({
          email: formData.email,
          password: formData.password,
        });
        setSuccess("Login realizado com sucesso!");
      } else {
        await signupMutation.mutateAsync({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        setSuccess("Conta criada com sucesso! Redirecionando...");
        setTimeout(() => {
          setMode("login");
          setFormData({
            email: formData.email,
            password: "",
            username: "",
            confirmPassword: "",
            rememberMe: false,
          });
        }, 1500);
      }
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Erro ao processar solicitação"
      );
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setLocalError(null);
    setSuccess(null);
    setFormData({
      email: "",
      password: "",
      username: "",
      confirmPassword: "",
      rememberMe: false,
    });
  };

  const errorMsg = loginMutation.error?.message || signupMutation.error?.message || localError;

  return (
    <div className="min-h-screen bg-[#e8f5e9] flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#4caf50] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-bold text-gray-900">ByteBank</span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#4caf50] rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
            </h1>
            <p className="text-gray-500 text-sm">
              {mode === "login" ? "Entre na sua conta ByteBank" : "Comece sua jornada financeira"}
            </p>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 text-sm">{errorMsg}</span>
            </div>
          )}

            {success && (
            <div className="mb-4 p-4 bg-[#e8f5e9] border border-[#c8e6c9] rounded-xl flex items-start gap-3">
              <svg className="w-5 h-5 text-[#4caf50] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700 text-sm">{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username - Only on Signup */}
            {mode === "signup" && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Seu nome de usuário"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4caf50] focus:border-transparent transition-all outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4caf50] focus:border-transparent transition-all outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={loading}
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4caf50] focus:border-transparent transition-all outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={loading}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
              />
            </div>

            {/* Confirm Password - Only on Signup */}
            {mode === "signup" && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4caf50] focus:border-transparent transition-all outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                  disabled={loading}
                  autoComplete="new-password"
                  required
                />
              </div>
            )}

            {/* Remember Me - Only on Login */}
            {mode === "login" && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#4caf50] border-gray-300 rounded focus:ring-2 focus:ring-[#4caf50] disabled:cursor-not-allowed accent-[#4caf50]"
                  disabled={loading}
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer select-none">
                  Manter-me conectado
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3.5 px-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {mode === "login" ? "Entrando..." : "Criando conta..."}
                </>
              ) : (
                <>
                  {mode === "login" ? "ENTRAR" : "CRIAR CONTA"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {mode === "login" ? "Não tem conta?" : "Já tem conta?"}
            <button
              type="button"
              className="ml-2 text-gray-900 hover:text-[#4caf50] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={toggleMode}
              disabled={loading}
            >
              {mode === "login" ? "Registre-se" : "Faça login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
