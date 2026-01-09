import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getStatement } from "~/services/account"; // O serviço que chama o backend real

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return new NextResponse(JSON.stringify({ message: "Não autorizado" }), {
      status: 401,
    });
  }

  try {
    // A API Route (no servidor) chama o serviço que chama o backend
    const data = await getStatement({ token });
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API /statement] Erro ao buscar extrato:", error);
    return new NextResponse(
      JSON.stringify({ message: "Erro interno ao buscar extrato" }),
      { status: 500 },
    );
  }
}
