import { Injectable } from '@nestjs/common';
import { isValidUuid } from 'src/utils/isValidUuid';
import { v4 } from 'uuid';
import { User } from './database/user.interface';
import { usersData } from './database/users.data';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

interface Response {
  status: number;
  body: Partial<User> | { message: string };
}

@Injectable()
export class UsersService {
  public data: User[];

  constructor() {
    this.data = usersData;
  }

  async getAll(): Promise<Partial<User>[]> {
    return this.data.map(({ id, login, version, createdAt, updatedAt }) => ({
      id,
      login,
      version,
      createdAt,
      updatedAt,
    }));
  }

  async getOneById(id: string): Promise<Response> {
    if (isValidUuid(id)) {
      const foundUser = this.data.find((user) => user.id === id);

      if (foundUser) {
        return {
          status: 200,
          body: {
            id: foundUser.id,
            login: foundUser.login,
            version: foundUser.version,
            createdAt: foundUser.createdAt,
            updatedAt: foundUser.updatedAt,
          },
        };
      } else {
        return {
          status: 404,
          body: {
            message: `User with this id ${id} is not found`,
          },
        };
      }
    } else {
      return {
        status: 400,
        body: {
          message: `This id ${id} is not valid`,
        },
      };
    }
  }

  async createUser({ login, password }: CreateUserDto): Promise<Response> {
    const newUser: User = {
      id: v4(),
      login,
      password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.data.push(newUser);

    return {
      status: 201,
      body: {
        id: newUser.id,
        login: newUser.login,
        version: newUser.version,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    };
  }

  async updatePassword({
    id,
    dto,
  }: {
    id: string;
    dto: UpdatePasswordDto;
  }): Promise<Response> {
    if (isValidUuid(id)) {
      const { oldPassword, newPassword } = dto;

      const foundUserIndex = this.data.findIndex((user) => user.id === id);

      if (foundUserIndex > -1) {
        const foundUser = this.data[foundUserIndex];
        if (foundUser.password === oldPassword) {
          const updatedUser = {
            id: foundUser.id,
            login: foundUser.login,
            password: newPassword,
            version: foundUser.version + 1,
            createdAt: foundUser.createdAt,
            updatedAt: Date.now(),
          };

          this.data[foundUserIndex] = updatedUser;

          return {
            status: 200,
            body: {
              id: updatedUser.id,
              login: updatedUser.login,
              version: updatedUser.version,
              createdAt: updatedUser.createdAt,
              updatedAt: updatedUser.updatedAt,
            },
          };
        } else {
          return {
            status: 403,
            body: {
              message: `The old password you entered is not the correct one.`,
            },
          };
        }
      } else {
        return {
          status: 404,
          body: {
            message: `User with this id ${id} is not found`,
          },
        };
      }
    } else {
      return {
        status: 400,
        body: {
          message: `This id ${id} is not valid`,
        },
      };
    }
  }

  async deleteUser(id: string): Promise<Response> {
    if (isValidUuid(id)) {
      const foundUserIndex = this.data.findIndex((user) => user.id === id);

      if (foundUserIndex > -1) {
        this.data.splice(foundUserIndex, 1);
        return {
          status: 204,
          body: {
            message: `User with this id ${id} has been deleted`,
          },
        };
      } else {
        return {
          status: 404,
          body: {
            message: `User with this id ${id} is not found`,
          },
        };
      }
    } else {
      return {
        status: 400,
        body: {
          message: `This id ${id} is not valid`,
        },
      };
    }
  }
}
