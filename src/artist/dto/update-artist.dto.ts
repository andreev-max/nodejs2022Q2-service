import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateArtistDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}
