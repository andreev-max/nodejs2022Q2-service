import { Injectable } from '@nestjs/common';
import { User } from './database/user.interface';
import { usersData } from './database/users.data';

@Injectable()
export class UsersService {
  public data: User[];

  constructor() {
    this.data = usersData;
  }

  async getAll(): Promise<User[]> {
    return this.data;
  }

  async getOneById(id: string) {
    return this.data.find((user) => user.id === id);
  }
}
