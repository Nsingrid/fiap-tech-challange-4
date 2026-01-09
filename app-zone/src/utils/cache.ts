/**
 * Cache Service - Sistema de cache avançado para otimização de performance
 * Utiliza IndexedDB para cache persistente e memória para cache temporário
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class CacheService {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private dbName = 'app-cache';
  private storeName = 'cache-store';
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDB();
  }

  /**
   * Inicializa o IndexedDB para cache persistente
   */
  private async initDB(): Promise<void> {
    if (typeof window === 'undefined') return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  /**
   * Armazena dados no cache (memória e IndexedDB)
   * @param key - Chave única para identificar o cache
   * @param data - Dados a serem armazenados
   * @param expiresIn - Tempo de expiração em milissegundos (padrão: 5 minutos)
   */
  async set<T>(key: string, data: T, expiresIn: number = 5 * 60 * 1000): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresIn,
    };

    // Cache em memória para acesso rápido
    this.memoryCache.set(key, entry);

    // Cache persistente no IndexedDB
    if (this.db) {
      try {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        store.put(entry, key);
      } catch (error) {
        console.error('Erro ao salvar no IndexedDB:', error);
      }
    }
  }

  /**
   * Recupera dados do cache
   * @param key - Chave do cache
   * @returns Dados armazenados ou null se expirado/não encontrado
   */
  async get<T>(key: string): Promise<T | null> {
    // Tenta pegar do cache em memória primeiro (mais rápido)
    const memEntry = this.memoryCache.get(key);
    if (memEntry && this.isValid(memEntry)) {
      return memEntry.data as T;
    }

    // Se não encontrou em memória, tenta no IndexedDB
    if (this.db) {
      try {
        const entry = await this.getFromIndexedDB<T>(key);
        if (entry && this.isValid(entry)) {
          // Restaura no cache de memória
          this.memoryCache.set(key, entry);
          return entry.data;
        }
      } catch (error) {
        console.error('Erro ao ler do IndexedDB:', error);
      }
    }

    return null;
  }

  /**
   * Recupera entrada do IndexedDB
   */
  private getFromIndexedDB<T>(key: string): Promise<CacheEntry<T> | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve(null);
        return;
      }

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Verifica se o cache ainda é válido
   */
  private isValid(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp < entry.expiresIn;
  }

  /**
   * Remove uma entrada específica do cache
   */
  async remove(key: string): Promise<void> {
    this.memoryCache.delete(key);

    if (this.db) {
      try {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        store.delete(key);
      } catch (error) {
        console.error('Erro ao remover do IndexedDB:', error);
      }
    }
  }

  /**
   * Limpa todo o cache
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();

    if (this.db) {
      try {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        store.clear();
      } catch (error) {
        console.error('Erro ao limpar IndexedDB:', error);
      }
    }
  }

  /**
   * Remove entradas expiradas do cache
   */
  async cleanup(): Promise<void> {
    // Limpa cache de memória
    for (const [key, entry] of this.memoryCache.entries()) {
      if (!this.isValid(entry)) {
        this.memoryCache.delete(key);
      }
    }

    // Limpa IndexedDB
    if (this.db) {
      try {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.openCursor();

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            const entry = cursor.value as CacheEntry<any>;
            if (!this.isValid(entry)) {
              cursor.delete();
            }
            cursor.continue();
          }
        };
      } catch (error) {
        console.error('Erro ao limpar entradas expiradas:', error);
      }
    }
  }
}

// Instância singleton
export const cacheService = new CacheService();

// Limpa cache expirado a cada 10 minutos
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheService.cleanup();
  }, 10 * 60 * 1000);
}
