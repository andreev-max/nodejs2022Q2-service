import { ForbiddenException, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { IUser, IUserWithoutPassword } from 'src/interfaces';
import db from 'src/db/DB';
import { MESSAGES } from 'src/constants';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  type: string;

  constructor() {
    this.type = 'user';
  }

  async getAll(): Promise<IUserWithoutPassword[]> {
    const foundUsers = (await db.getAll(this.type)) as IUser[];

    return foundUsers.map(({ login, id, createdAt, updatedAt, version }) => ({
      login,
      id,
      createdAt,
      updatedAt,
      version,
    }));
  }

  async getOneById(uuid: string): Promise<IUserWithoutPassword> {
    const foundUser = (await db.getOneById(this.type, uuid)) as IUser;

    const { login, createdAt, updatedAt, id, version } = foundUser;

    return {
      login,
      createdAt,
      updatedAt,
      id,
      version,
    };
  }

  async create(createUserDto: CreateUserDto): Promise<IUserWithoutPassword> {
    const newUser = {
      ...createUserDto,
      id: v4(),
      createdAt: Date.now(),
      version: 1,
      updatedAt: Date.now(),
    };

    const createdUser: IUser = (await db.create(this.type, newUser)) as IUser;

    const { login, createdAt, updatedAt, id, version } = createdUser;

    return {
      login,
      createdAt,
      updatedAt,
      id,
      version,
    };
  }

  async update(
    uuid: string,
    updateUserDto: UpdateUserDto,
  ): Promise<IUserWithoutPassword> {
    const oldUser = (await db.getOneById(this.type, uuid)) as IUser;

    if (oldUser.password !== updateUserDto.oldPassword) {
      throw new ForbiddenException(MESSAGES.OLD_PASSWORD_WRONG);
    }

    const userForUpdate = {
      ...oldUser,
      password: updateUserDto.newPassword,
      version: oldUser.version + 1,
      updatedAt: Date.now(),
    };

    const createdUser = (await db.update(
      this.type,
      uuid,
      userForUpdate,
    )) as IUser;

    const { login, createdAt, updatedAt, id, version } = createdUser;

    return {
      login,
      createdAt,
      updatedAt,
      id,
      version,
    };
  }

  async delete(uuid: string): Promise<IUserWithoutPassword> {
    const deletedUser = (await db.delete(this.type, uuid)) as IUser;
    const { login, createdAt, updatedAt, id, version } = deletedUser;

    return {
      login,
      createdAt,
      updatedAt,
      id,
      version,
    };
  }
}
