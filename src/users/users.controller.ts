import { Controller, Get, Param } from '@nestjs/common';
import { User } from './database/user.interface';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @Get(':id')
  getOneById(@Param('id') id: string) {
    return this.usersService.getOneById(id);
  }
}
