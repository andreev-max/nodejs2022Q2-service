import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'old password' })
  @IsNotEmpty({ message: 'old password should be not empty' })
  @IsString({ message: 'old password should be a string' })
  readonly oldPassword: string;

  @ApiProperty({ description: 'new password' })
  @IsNotEmpty({ message: 'new password should be not empty' })
  @IsString({ message: 'new password should be a string' })
  readonly newPassword: string;
}
