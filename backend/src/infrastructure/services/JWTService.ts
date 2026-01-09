import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
}

export class JWTService {
  private secret: string;
  private expiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'default-secret-key';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { 
      expiresIn: this.expiresIn
    } as jwt.SignOptions);
  }

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.secret) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
