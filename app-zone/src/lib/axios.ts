import axios, { type InternalAxiosRequestConfig } from 'axios';
import { cacheService } from '~/utils/cache';

// Estende o tipo para incluir metadata customizado
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: { cacheKey: string };
  _retry?: boolean;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3333';

// Cookie helper com segurança aprimorada
const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  
  return null;
};

export const setCookie = (name: string, value: string, days: number = 7): void => {
  if (typeof window === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  // Em produção com domínios diferentes, usamos SameSite=None + Secure
  // Em desenvolvimento, usamos SameSite=Lax
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSite = isProduction ? 'None' : 'Lax';
  const secureFlag = isProduction ? '; Secure' : '';
  
  document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=${sameSite}${secureFlag}`;
};

export const deleteCookie = (name: string): void => {
  if (typeof window === 'undefined') return;
  // Deve usar as mesmas opções do setCookie para deletar corretamente
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSite = isProduction ? 'None' : 'Lax';
  const secureFlag = isProduction ? '; Secure' : '';
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=${sameSite}${secureFlag}`;
};

/**
 * Limpa cache de endpoints específicos
 */
export async function clearEndpointCache(endpoints: string[]): Promise<void> {
  for (const endpoint of endpoints) {
    const cacheKey = `api_${endpoint}_${JSON.stringify({})}`;
    await cacheService.remove(cacheKey);
  }
}

// Instância configurada do axios com timeout
// NEXT_PUBLIC_BACKEND_URL já inclui /api no .env
export const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 15000, // 15 segundos
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para adicionar token de autenticação e cache
api.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    const token = getCookie('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Endpoints que NÃO devem ser cacheados (dados dinâmicos)
    const noCacheEndpoints = ['/account', '/statement', '/investments/transactions'];
    const shouldNotCache = noCacheEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    // Verifica se deve bypassar o cache
    const bypassCache = config.headers['X-Bypass-Cache'] === 'true';
    
    // Implementa cache para requisições GET (se não for bypass e não for endpoint crítico)
    if (config.method === 'get' && config.url && !bypassCache && !shouldNotCache) {
      const cacheKey = `api_${config.url}_${JSON.stringify(config.params || {})}`;
      const cached = await cacheService.get(cacheKey);
      
      if (cached) {
        // Retorna dados do cache
        return Promise.reject({
          config,
          response: { data: cached },
          cached: true,
        });
      }
      
      // Armazena chave do cache no config para uso posterior
      config.metadata = { cacheKey };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros com retry logic
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  async (response) => {
    // Armazena resposta no cache se for GET
    const config = response.config as CustomAxiosRequestConfig;
    if (config.method === 'get' && config.metadata?.cacheKey) {
      await cacheService.set(config.metadata.cacheKey, response.data, 5 * 60 * 1000); // 5 minutos
    }
    return response;
  },
  async (error) => {
    // Se foi retorno do cache, resolve com sucesso
    if (error.cached) {
      return Promise.resolve(error.response);
    }

    const originalRequest = error.config;

    // Erro de rede ou timeout
    if (!error.response) {
      console.error('Erro de conexão com o servidor');
      return Promise.reject(new Error('Erro de conexão. Verifique sua internet.'));
    }

    // Token expirado ou inválido
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Aguarda o refresh do token
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Limpa tokens e redireciona
      deleteCookie('authToken');
      deleteCookie('username');
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      processQueue(error, null);
      isRefreshing = false;
    }

    // Erro de permissão
    if (error.response.status === 403) {
      console.error('Acesso negado');
    }

    // Erro do servidor
    if (error.response.status >= 500) {
      console.error('Erro no servidor:', error.response.data);
    }

    return Promise.reject(error);
  }
);

