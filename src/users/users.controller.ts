import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { User } from './database/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @Get(':id')
  async getOneById(@Param('id') id: string, @Res() res: Response) {
    const { status, body } = await this.usersService.getOneById(id);
    res.status(status).send(body);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const { status, body } = await this.usersService.createUser(createUserDto);
    res.status(status).send(body);
  }

  @Put(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Res() res: Response,
  ) {
    const { status, body } = await this.usersService.updatePassword({
      id,
      updatePasswordDto,
    });
    res.status(status).send(body);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    const { status, body } = await this.usersService.deleteUser(id);
    res.status(status).send(body);
  }
}
