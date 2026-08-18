import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsMongoId,
  IsArray,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsMongoId()
  @IsOptional()
  lead?: string;

  @IsMongoId({ each: true })
  @IsArray()
  @IsOptional()
  members?: string[];

  @IsMongoId()
  @IsOptional()
  teams?: string;

  @IsString()
  @IsNotEmpty()
  dueDate?: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  labels?: string[];
}
