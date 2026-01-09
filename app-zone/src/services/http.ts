/**
 * Cache simples em memória para requisições HTTP
 * Reduz requisições desnecessárias e melhora performance
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

type CacheStore = Record<string, CacheEntry<unknown>>;

const cache: CacheStore = {};
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

/**
 * Gera uma chave de cache baseada em URL e opções
 */
function generateCacheKey(url: string, options?: RequestInit): string {
  const method = options?.method || "GET";
  const body = options?.body ? JSON.stringify(options.body) : "";
  return `${method}:${url}:${body}`;
}

/**
 * Verifica se uma entrada está no cache e é válida
 */
function isCached<T>(key: string, ttl: number = DEFAULT_TTL): boolean {
  const entry = cache[key];
  if (!entry) return false;
  return Date.now() - entry.timestamp < ttl;
}

/**
 * Obtém dados do cache
 */
function getFromCache<T>(key: string): T | null {
  const entry = cache[key];
  return entry ? (entry.data as T) : null;
}

/**
 * Armazena dados no cache
 */
function setCache<T>(key: string, data: T): void {
  cache[key] = {
    data,
    timestamp: Date.now(),
  };
}

/**
 * Limpa o cache
 */
function clearCache(pattern?: string): void {
  if (!pattern) {
    Object.keys(cache).forEach((key) => delete cache[key]);
  } else {
    Object.keys(cache)
      .filter((key) => key.includes(pattern))
      .forEach((key) => delete cache[key]);
  }
}

/**
 * Fetch com suporte a cache
 */
async function cachedFetch<T>(
  url: string,
  options?: RequestInit & { cacheTTL?: number }
): Promise<T> {
  const { cacheTTL = DEFAULT_TTL, ...fetchOptions } = options || {};
  const cacheKey = generateCacheKey(url, fetchOptions);

  // Apenas GET pode ser cacheado
  const shouldCache = (fetchOptions.method || "GET") === "GET";

  // Verifica cache
  if (shouldCache && isCached(cacheKey, cacheTTL)) {
    return getFromCache<T>(cacheKey)!;
  }

  // Faz a requisição
  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();

  // Armazena no cache se for GET
  if (shouldCache) {
    setCache(cacheKey, data);
  }

  return data;
}

export const httpService = {
  fetch: cachedFetch,
  cache: {
    get: getFromCache,
    set: setCache,
    clear: clearCache,
    isCached,
  },
};
