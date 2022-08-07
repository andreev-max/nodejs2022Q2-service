import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'login', example: 'TEST_USER' })
  @IsNotEmpty({ message: 'login should be not empty' })
  @IsString({ message: 'login should be a string' })
  readonly login: string;

  @ApiProperty({ description: 'password', example: '12345678' })
  @IsNotEmpty({ message: 'password should be not empty' })
  @IsString({ message: 'password should be a string' })
  readonly password: string;
}
