import { IUserRepository } from '../repositories/IUserRepository';
import { IAccountRepository } from '../repositories/IAccountRepository';
import { User, CreateUserDTO } from '../entities/User';
import { AppError } from '../../shared/errors/AppError';

export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private accountRepository: IAccountRepository,
  ) {}

  async execute(data: CreateUserDTO): Promise<User> {
    // Verificar se email já existe
    const emailExists = await this.userRepository.findByEmail(data.email);
    if (emailExists) {
      throw new AppError('Email already exists', 400);
    }

    // Verificar se username já existe
    const usernameExists = await this.userRepository.findByUsername(data.username);
    if (usernameExists) {
      throw new AppError('Username already exists', 400);
    }

    // Criar usuário
    const user = await this.userRepository.create(data);

    // Criar conta automaticamente para o usuário
    const accountNumber = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    await this.accountRepository.create({
      userId: user.id,
      accountNumber,
      accountType: 'CHECKING',
      balance: BigInt(0),
    });

    return user;
  }
}
