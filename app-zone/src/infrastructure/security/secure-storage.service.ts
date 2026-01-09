/**
 * Infrastructure: Secure Storage Service
 * Armazenamento seguro com criptografia para dados sensíveis
 */

import { encryptionService } from './encryption.service';

class SecureStorageService {
  private readonly storageKey = '__secure_app_data__';
  private readonly encryptionPassword: string;

  constructor() {
    // Em produção, isso deveria vir de uma variável de ambiente
    // ou ser gerado por usuário
    this.encryptionPassword = process.env.NEXT_PUBLIC_STORAGE_KEY || 'fiap-tech-challenge-secure-key-2024';
  }

  /**
   * Armazena dados sensíveis de forma segura
   */
  async setItem(key: string, value: unknown): Promise<void> {
    try {
      const data = JSON.stringify(value);
      const encrypted = await encryptionService.encrypt(data, this.encryptionPassword);
      
      if (typeof window !== 'undefined') {
        const storage = this.getStorage();
        storage.setItem(`${this.storageKey}_${key}`, encrypted);
      }
    } catch (error) {
      console.error('Secure storage set error:', error);
      throw new Error('Failed to store secure data');
    }
  }

  /**
   * Recupera dados sensíveis armazenados
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      if (typeof window === 'undefined') {
        return null;
      }

      const storage = this.getStorage();
      const encrypted = storage.getItem(`${this.storageKey}_${key}`);
      
      if (!encrypted) {
        return null;
      }

      const decrypted = await encryptionService.decrypt(encrypted, this.encryptionPassword);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Secure storage get error:', error);
      return null;
    }
  }

  /**
   * Remove item do armazenamento seguro
   */
  removeItem(key: string): void {
    if (typeof window !== 'undefined') {
      const storage = this.getStorage();
      storage.removeItem(`${this.storageKey}_${key}`);
    }
  }

  /**
   * Limpa todo o armazenamento seguro
   */
  clear(): void {
    if (typeof window !== 'undefined') {
      const storage = this.getStorage();
      const keys = Object.keys(storage);
      
      keys.forEach(key => {
        if (key.startsWith(this.storageKey)) {
          storage.removeItem(key);
        }
      });
    }
  }

  /**
   * Obtém o storage apropriado (sessionStorage por padrão por segurança)
   */
  private getStorage(): Storage {
    return typeof window !== 'undefined' ? window.sessionStorage : ({} as Storage);
  }
}

export const secureStorage = new SecureStorageService();
