/**
 * Enhanced HTTP Service with Advanced Caching
 * Service HTTP otimizado com cache avançado e retry logic
 */

interface CacheConfig {
  ttl: number; // Time to live em ms
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;
}

type CacheStore = Map<string, CacheEntry<unknown>>;

class EnhancedHttpService {
  private cache: CacheStore = new Map();
  private pendingRequests: Map<string, Promise<unknown>> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 segundo

  /**
   * Gera chave de cache baseada em URL e opções
   */
  private getCacheKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  /**
   * Verifica se cache é válido
   */
  private isCacheValid(entry: CacheEntry<unknown>, ttl: number): boolean {
    return Date.now() - entry.timestamp < ttl;
  }

  /**
   * Busca dados do cache
   */
  private getFromCache<T>(key: string, ttl: number): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (this.isCacheValid(entry, ttl)) {
      return entry.data;
    }

    // Remove cache expirado
    this.cache.delete(key);
    return null;
  }

  /**
   * Armazena no cache
   */
  private setCache<T>(key: string, data: T, etag?: string): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      etag,
    });
  }

  /**
   * Executa requisição com retry
   */
  private async fetchWithRetry<T>(
    url: string,
    options?: RequestInit,
    retries = this.MAX_RETRIES
  ): Promise<T> {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const etag = response.headers.get('etag') || undefined;
      const data = await response.json();

      return { data, etag } as T;
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
        return this.fetchWithRetry<T>(url, options, retries - 1);
      }
      throw error;
    }
  }

  /**
   * Fetch com estratégia de cache
   */
  async fetch<T>(
    url: string,
    options?: RequestInit & { cacheConfig?: Partial<CacheConfig> }
  ): Promise<T> {
    const { cacheConfig, ...fetchOptions } = options || {};
    const config: CacheConfig = {
      ttl: cacheConfig?.ttl || this.DEFAULT_TTL,
      strategy: cacheConfig?.strategy || 'cache-first',
    };

    const cacheKey = this.getCacheKey(url, fetchOptions);
    const isGetRequest = (fetchOptions.method || 'GET') === 'GET';

    // Apenas GET pode usar cache
    if (!isGetRequest) {
      return this.fetchWithRetry<T>(url, fetchOptions);
    }

    // Evita requisições duplicadas simultâneas
    const pendingRequest = this.pendingRequests.get(cacheKey);
    if (pendingRequest) {
      return pendingRequest as Promise<T>;
    }

    // Cache-first strategy
    if (config.strategy === 'cache-first') {
      const cached = this.getFromCache<T>(cacheKey, config.ttl);
      if (cached) return cached;
    }

    // Network request
    const requestPromise = this.fetchWithRetry<T>(url, fetchOptions)
      .then((result: any) => {
        this.setCache(cacheKey, result.data, result.etag);
        this.pendingRequests.delete(cacheKey);
        return result.data;
      })
      .catch(error => {
        this.pendingRequests.delete(cacheKey);
        
        // Fallback para cache stale se disponível
        const cached = this.cache.get(cacheKey);
        if (cached) {
          console.warn('Using stale cache due to network error:', error);
          return cached.data as T;
        }
        
        throw error;
      });

    this.pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
  }

  /**
   * Invalida cache por padrão
   */
  invalidateCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Pré-carrega dados
   */
  async prefetch<T>(url: string, options?: RequestInit): Promise<void> {
    try {
      await this.fetch<T>(url, options);
    } catch (error) {
      console.warn('Prefetch failed:', error);
    }
  }
}

export const enhancedHttpService = new EnhancedHttpService();
