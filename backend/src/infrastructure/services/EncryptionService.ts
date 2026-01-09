import CryptoJS from 'crypto-js';

/**
 * Serviço de criptografia para dados sensíveis
 * Utiliza AES-256 para criptografia simétrica
 */
export class EncryptionService {
  private readonly encryptionKey: string;

  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production';
    
    if (this.encryptionKey === 'default-encryption-key-change-in-production' && process.env.NODE_ENV === 'production') {
      console.warn('⚠️  WARNING: Using default encryption key in production! Please set ENCRYPTION_KEY environment variable.');
    }
  }

  /**
   * Criptografa uma string usando AES-256
   */
  encrypt(text: string): string {
    try {
      return CryptoJS.AES.encrypt(text, this.encryptionKey).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Descriptografa uma string criptografada
   */
  decrypt(encryptedText: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, this.encryptionKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decrypted) {
        throw new Error('Decryption resulted in empty string');
      }
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Gera hash SHA-256 de uma string (útil para validação de integridade)
   */
  hash(text: string): string {
    return CryptoJS.SHA256(text).toString();
  }

  /**
   * Mascara dados sensíveis para logs (ex: cartões de crédito)
   */
  mask(text: string, visibleChars: number = 4): string {
    if (text.length <= visibleChars) {
      return '*'.repeat(text.length);
    }
    const masked = '*'.repeat(text.length - visibleChars);
    return masked + text.slice(-visibleChars);
  }
}

// Instância singleton
export const encryptionService = new EncryptionService();
