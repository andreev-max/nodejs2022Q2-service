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
  constructor(private readonly service: UsersService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.service.getAll();
  }

  @Get(':id')
  async getOneById(@Param('id') id: string, @Res() res: Response) {
    const { status, body } = await this.service.getOneById(id);
    res.status(status).send(body);
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto, @Res() res: Response) {
    const { status, body } = await this.service.createUser(dto);
    res.status(status).send(body);
  }

  @Put(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() dto: UpdatePasswordDto,
    @Res() res: Response,
  ) {
    const { status, body } = await this.service.updatePassword({
      id,
      dto,
    });
    res.status(status).send(body);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    const { status, body } = await this.service.deleteUser(id);
    res.status(status).send(body);
  }
}
