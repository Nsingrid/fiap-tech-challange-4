import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Remove os cookies de autenticação
    const cookieStore = await cookies();
    cookieStore.delete("authToken");
    cookieStore.delete("username");

    return NextResponse.json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    console.error("[API /auth/logout] Erro:", error);
    return new NextResponse(
      JSON.stringify({ message: "Erro interno ao processar logout" }),
      { status: 500 }
    );
  }
}
