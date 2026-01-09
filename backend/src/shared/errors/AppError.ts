/**
 * Classe de erro customizada para a aplicação
 * Suporta mensagens detalhadas e códigos de status HTTP
 */
export class AppError extends Error {
  public readonly message: string;
  public readonly statusCode: number;
  public readonly details?: any;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 400, details?: any) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    // Mantém stack trace correto
    Error.captureStackTrace(this, this.constructor);
  }
}
