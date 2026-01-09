import NodeCache from 'node-cache';

/**
 * Serviço de cache em memória para otimização de performance
 * Reduz consultas repetidas ao banco de dados
 */
export class CacheService {
  private cache: NodeCache;

  constructor(ttlSeconds: number = 300) {
    // TTL padrão de 5 minutos
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });

    // Log de estatísticas a cada 5 minutos
    setInterval(() => {
      const stats = this.cache.getStats();
      console.log('📊 Cache Stats:', {
        keys: stats.keys,
        hits: stats.hits,
        misses: stats.misses,
        hitRate: stats.hits / (stats.hits + stats.misses) || 0,
      });
    }, 300000);
  }

  /**
   * Busca valor do cache
   */
  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  /**
   * Armazena valor no cache
   */
  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || 0);
  }

  /**
   * Remove valor específico do cache
   */
  delete(key: string): number {
    return this.cache.del(key);
  }

  /**
   * Remove múltiplas chaves com padrão
   */
  deletePattern(pattern: string): number {
    const keys = this.cache.keys();
    const keysToDelete = keys.filter((key) => key.includes(pattern));
    return this.cache.del(keysToDelete);
  }

  /**
   * Limpa todo o cache
   */
  flush(): void {
    this.cache.flushAll();
  }

  /**
   * Obtém estatísticas do cache
   */
  getStats() {
    return this.cache.getStats();
  }
}

// Instância singleton do serviço de cache
export const cacheService = new CacheService();
