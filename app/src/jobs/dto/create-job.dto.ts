import {
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsBooleanString,
} from 'class-validator';
import {
  TISSUEOptions,
} from '../models/loci2path.model';

export class CreateJobDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  job_name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsBooleanString()
  useTest: string;

  @IsNumberString()
  chr: string;

  @IsNumberString()
  start_position: string;

  @IsNumberString()
  stop_position: string;

  @IsNotEmpty()
  @IsEnum(TISSUEOptions)
  tissue: TISSUEOptions;

}
