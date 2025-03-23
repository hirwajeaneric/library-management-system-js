import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

export class UserModel {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createUser(username: string, password: string, email: string, role: Role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { username, password: hashedPassword, email, role }
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }
}