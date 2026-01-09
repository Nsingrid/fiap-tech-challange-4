import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getAccount } from "~/services/account";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return new NextResponse(JSON.stringify({ message: "Não autorizado" }), {
      status: 401,
    });
  }

  try {
    const data = await getAccount({ token });
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API /account] Erro ao buscar conta:", error);
    return new NextResponse(
      JSON.stringify({ message: "Erro interno ao buscar conta" }),
      { status: 500 },
    );
  }
}
