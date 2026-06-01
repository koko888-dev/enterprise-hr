import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

const userSelect = {
  id: true,
  username: true,
  email: true,
  status: true,
  last_login_at: true,
  created_at: true,
  updated_at: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.users.create({
      data: createUserDto,
      select: userSelect,
    });
  }

  async findAll() {
    return this.prisma.users.findMany({
      select: userSelect,
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: userSelect,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Verify user exists first
    await this.findOne(id);

    return this.prisma.users.update({
      where: { id },
      data: updateUserDto,
      select: userSelect,
    });
  }

  async remove(id: number) {
    // Verify user exists first
    await this.findOne(id);

    return this.prisma.users.delete({
      where: { id },
      select: userSelect,
    });
  }
}

