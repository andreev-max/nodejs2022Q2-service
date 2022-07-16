import { Injectable } from '@nestjs/common';
import { isValidUuid } from 'src/utils/isValidUuid';
import { v4 } from 'uuid';
import { User } from './database/user.interface';
import { usersData } from './database/users.data';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

interface Response {
  status: number;
  body: User | { message: string };
}

@Injectable()
export class UsersService {
  public data: User[];

  constructor() {
    this.data = usersData;
  }

  async getAll(): Promise<User[]> {
    return this.data.map((user) => ({
      ...user,
      password: null,
    }));
  }

  async getOneById(id: string): Promise<Response> {
    if (isValidUuid(id)) {
      const foundUser = this.data.find((user) => user.id === id);

      if (foundUser) {
        return {
          status: 200,
          body: { ...foundUser, password: null },
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
      body: { ...newUser, password: null },
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
          this.data[foundUserIndex] = {
            ...foundUser,
            password: newPassword,
          };

          return {
            status: 200,
            body: {
              message: `The password has been updated`,
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
