import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { IsIdNullOrString } from 'src/decorators/idValidation.decorator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsIdNullOrString()
  @ValidateIf((o) => typeof o.artistId === 'string')
  @IsUUID()
  artistId: string | null;

  @IsIdNullOrString()
  @ValidateIf((o) => typeof o.albumId === 'string')
  @IsUUID()
  @IsIdNullOrString()
  albumId: string | null;

  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
