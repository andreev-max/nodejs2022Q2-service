import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { IsIdNullOrString } from 'src/decorators/idValidation.decorator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsIdNullOrString()
  @ValidateIf((o) => typeof o.artistId === 'string')
  @IsUUID()
  artistId: string | null;

  @IsNotEmpty()
  @IsNumber()
  year: number;
}
