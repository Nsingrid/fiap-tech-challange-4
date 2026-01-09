import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import 'express-async-errors';
import dotenv from 'dotenv';

import { router } from './presentation/routes';
import { errorHandler } from './presentation/middlewares/errorHandler';
import { requestLogger } from './presentation/middlewares/requestLogger';
import { globalRateLimiter } from './presentation/middlewares/rateLimiter';
import { setupSecurityMiddlewares } from './presentation/middlewares/securityMiddleware';
import { connectDatabase, disconnectDatabase } from './infrastructure/database/prisma';

// Carregar variáveis de ambiente
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3333;

// ========================================
// CORS (DEVE SER O PRIMEIRO!)
// ========================================

// Configurar CORS - ANTES de qualquer outro middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  }),
);

// ========================================
// SEGURANÇA E PERFORMANCE
// ========================================

// Configurar middlewares de segurança (Helmet)
setupSecurityMiddlewares(app);

// Compressão de respostas (melhora performance)
app.use(
  compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
    level: 6, // Nível de compressão (0-9)
  }),
);

// Rate limiting global
app.use('/api', globalRateLimiter);

// ========================================
// MIDDLEWARES PADRÃO
// ========================================

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Middleware de logging (deve ser antes das rotas)
app.use(requestLogger);

// ========================================
// ROTAS E TRATAMENTO DE ERROS
// ========================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Rotas da API
app.use('/api', router);

// Middleware de erro (deve ser o último)
app.use(errorHandler);

// ========================================
// INICIALIZAÇÃO DO SERVIDOR
// ========================================

async function startServer() {
  try {
    // Conectar ao banco de dados
    await connectDatabase();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('\n🚀 ================================');
      console.log('🚀 Server started successfully!');
      console.log('🚀 ================================');
      console.log(`📡 Server running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`🔒 Security middlewares: ✓ Enabled`);
      console.log(`⚡ Compression: ✓ Enabled`);
      console.log(`🛡️  Rate limiting: ✓ Enabled`);
      console.log(`📝 Request logging: ✓ Enabled`);
      console.log('🚀 ================================\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// ========================================
// GRACEFUL SHUTDOWN
// ========================================

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await disconnectDatabase();
  console.log('✅ Database disconnected');
  console.log('👋 Goodbye!');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await disconnectDatabase();
  console.log('✅ Database disconnected');
  console.log('👋 Goodbye!');
  process.exit(0);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Em produção, você pode querer fazer shutdown graceful aqui
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Iniciar aplicação
startServer();
