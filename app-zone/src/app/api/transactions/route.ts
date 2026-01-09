import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createTransaction } from "~/services/account";
import type { CreateTransactionParams } from "~/types/services";

/**
 * Route Handler para criar uma nova transação.
 * Atua como um proxy seguro para o backend real.
 */
export async function POST(request: Request) {
  // 1. Acessa a store de cookies do lado do servidor.
  //    Isso é seguro e só funciona em Server Components ou Route Handlers.
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  // 2. Guarda de rota: verifica se o token existe.
  if (!token) {
    // Se não houver token, a requisição não é autorizada.
    return new NextResponse(
      JSON.stringify({ message: "Não autorizado: Token não encontrado." }),
      { status: 401 },
    );
  }

  try {
    // 3. Extrai os dados da transação do corpo da requisição enviada pelo frontend.
    const body: Omit<CreateTransactionParams, "token"> = await request.json();

    // Validação simples para garantir que os dados necessários foram enviados
    if (!body.type || typeof body.value === "undefined") {
      return new NextResponse(
        JSON.stringify({ message: "Dados da transação inválidos." }),
        { status: 400 },
      );
    }

    // 4. Chama o serviço que se comunica com o backend real,
    //    passando o token obtido do cookie e os dados do corpo da requisição.
    const backendResponse = await createTransaction({
      token,
      type: body.type,
      value: body.value,
    });

    // 5. Retorna a resposta do backend para o frontend.
    return NextResponse.json(backendResponse);
  } catch (error) {
    // 6. Tratamento de erros, caso a chamada ao backend falhe.
    console.error("[API /transactions] Erro ao criar transação:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Erro interno do servidor ao processar a transação.",
      }),
      { status: 500 },
    );
  }
}
