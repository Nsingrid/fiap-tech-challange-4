import { Request, Response, NextFunction } from "express";

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  // Log da requisição recebida
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);

  // Interceptar o método res.end para capturar o status code e tempo de resposta
  const originalEnd = res.end.bind(res);
  
  res.end = function (chunk?: any, encoding?: any, callback?: any): Response {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Log da resposta
    console.log(
      `[${timestamp}] ${method} ${url} - Status: ${statusCode} - ${duration}ms - IP: ${ip}`
    );

    // Chamar o método original
    if (typeof encoding === 'function') {
      return originalEnd(chunk, encoding);
    }
    return originalEnd(chunk, encoding, callback);
  } as any;

  next();
}
