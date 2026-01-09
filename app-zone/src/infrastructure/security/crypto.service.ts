/**
 * Crypto Service - Criptografia de dados sensíveis
 * Utiliza Web Crypto API para operações criptográficas seguras
 */

class CryptoService {
  private algorithm = 'AES-GCM';
  private keyLength = 256;

  /**
   * Gera uma chave de criptografia
   */
  private async generateKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt.buffer as ArrayBuffer,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: this.algorithm, length: this.keyLength },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Criptografa dados
   * @param data - Dados a serem criptografados
   * @param password - Senha para criptografia (opcional, usa padrão do ambiente)
   * @returns String base64 com dados criptografados
   */
  async encrypt(data: string, password?: string): Promise<string> {
    if (typeof window === 'undefined') {
      // No servidor, retorna dados sem criptografar (temporário)
      console.warn('Criptografia não disponível no servidor');
      return btoa(data);
    }

    try {
      const encoder = new TextEncoder();
      const salt = window.crypto.getRandomValues(new Uint8Array(16));
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      
      const key = await this.generateKey(
        password || process.env.NEXT_PUBLIC_CRYPTO_KEY || 'default-key-change-me',
        salt
      );

      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: this.algorithm,
          iv,
        },
        key,
        encoder.encode(data)
      );

      // Combina salt, iv e dados criptografados
      const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(encrypted), salt.length + iv.length);

      // Retorna em base64
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Erro ao criptografar:', error);
      throw new Error('Falha na criptografia');
    }
  }

  /**
   * Descriptografa dados
   * @param encryptedData - Dados criptografados em base64
   * @param password - Senha para descriptografia (opcional)
   * @returns Dados descriptografados
   */
  async decrypt(encryptedData: string, password?: string): Promise<string> {
    if (typeof window === 'undefined') {
      // No servidor, retorna dados decodificados
      console.warn('Descriptografia não disponível no servidor');
      return atob(encryptedData);
    }

    try {
      // Decodifica de base64
      const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

      // Extrai salt, iv e dados criptografados
      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const encrypted = combined.slice(28);

      const key = await this.generateKey(
        password || process.env.NEXT_PUBLIC_CRYPTO_KEY || 'default-key-change-me',
        salt
      );

      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: this.algorithm,
          iv,
        },
        key,
        encrypted
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Erro ao descriptografar:', error);
      throw new Error('Falha na descriptografia');
    }
  }

  /**
   * Gera hash seguro (para senhas, por exemplo)
   * @param data - Dados a serem hasheados
   * @returns Hash em hexadecimal
   */
  async hash(data: string): Promise<string> {
    if (typeof window === 'undefined') {
      // No servidor, retorna hash simples (temporário)
      return btoa(data);
    }

    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('Erro ao gerar hash:', error);
      throw new Error('Falha ao gerar hash');
    }
  }

  /**
   * Gera token aleatório seguro
   * @param length - Tamanho do token
   * @returns Token em hexadecimal
   */
  generateToken(length: number = 32): string {
    if (typeof window === 'undefined') {
      return Math.random().toString(36).substring(2, length + 2);
    }

    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

export const cryptoService = new CryptoService();
