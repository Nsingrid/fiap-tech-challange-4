import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3333";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Faz a chamada para o backend real
    // NEXT_PUBLIC_BACKEND_URL já inclui /api
    const response = await fetch(`${BACKEND_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Falha ao criar conta" }));
      return new NextResponse(JSON.stringify(error), {
        status: response.status,
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API /auth/signup] Erro:", error);
    return new NextResponse(
      JSON.stringify({ message: "Erro interno ao processar cadastro" }),
      { status: 500 }
    );
  }
}
