import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, CreateUserDTO, UpdateUserDTO } from '../../domain/entities/User';
import { prisma } from '../database/prisma';
import bcrypt from 'bcryptjs';

export class PrismaUserRepository implements IUserRepository {
  async create(data: CreateUserDTO): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    return user;
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    const updateData: any = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return user;
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async list(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users;
  }
}
