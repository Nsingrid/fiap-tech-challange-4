import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Faz a chamada para o backend real
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Falha ao fazer login" }));
      return new NextResponse(JSON.stringify(error), {
        status: response.status,
      });
    }

    const data = await response.json();

    // Se o backend retornou um token, armazena em cookie
    if (data.result?.token) {
      const cookieStore = await cookies();
      cookieStore.set("authToken", data.result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        path: "/",
      });

      // Armazena o username/email também (não sensível, pode ser lido no cliente)
      if (data.result?.username || data.result?.email || body.email) {
        cookieStore.set("username", data.result?.username || data.result?.email || body.email, {
          httpOnly: false, // Permite leitura no cliente
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("[API /auth/login] Erro:", error);
    return new NextResponse(
      JSON.stringify({ message: "Erro interno ao processar login" }),
      { status: 500 }
    );
  }
}
