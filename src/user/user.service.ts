import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import {
  entityIsNotFound,
  ENTITY_TYPES,
  MESSAGES,
  selectUserWithoutPassword,
} from 'src/utils/constants';
import { PrismaService } from 'src/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  type: string;

  constructor(private prisma: PrismaService) {
    this.type = ENTITY_TYPES.USER;
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findById(id: string): Promise<User> {
    try {
      const foundUser = await this.prisma.user.findUnique({
        where: { id },
      });

      if (foundUser) {
        return foundUser;
      }

      throw new NotFoundException(entityIsNotFound(this.type, id));
    } catch (e) {
      throw new NotFoundException(entityIsNotFound(this.type, id));
    }
  }

  async create({
    login,
    password,
  }: CreateUserDto): Promise<Omit<User, 'password'>> {
    const currentTime = Date.now();

    return await this.prisma.user.create({
      data: {
        login,
        password,
        createdAt: currentTime,
        updatedAt: currentTime,
      },
      select: selectUserWithoutPassword,
    });
  }

  async update(
    id: string,
    { newPassword, oldPassword }: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const foundUser = await this.findById(id);

    if (foundUser.password !== oldPassword) {
      throw new ForbiddenException(MESSAGES.OLD_PASSWORD_WRONG);
    }

    const currentTime = Date.now();

    return this.prisma.user.update({
      where: { id },
      data: {
        ...foundUser,
        password: newPassword,
        updatedAt: currentTime,
        version: foundUser.version + 1,
      },
      select: selectUserWithoutPassword,
    });
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (e) {
      throw new NotFoundException(entityIsNotFound(this.type, id));
    }
  }
}
