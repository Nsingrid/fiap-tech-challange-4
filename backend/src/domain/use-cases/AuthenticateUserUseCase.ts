import { IUserRepository } from '../repositories/IUserRepository';
import { AppError } from '../../shared/errors/AppError';

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

interface AuthenticateUserResponse {
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export class AuthenticateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, password }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // A validação da senha será feita no controller usando bcrypt
    // pois não queremos lógica de infraestrutura no domínio

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    };
  }
}
