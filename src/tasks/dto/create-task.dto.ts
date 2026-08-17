import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsMongoId,
  IsArray,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsMongoId()
  @IsNotEmpty()
  reporter: string;

  @IsMongoId({ each: true })
  @IsArray()
  members: string[];

  // Add for the Teams menu option
  @IsMongoId()
  @IsOptional()
  teamId?: string;

  @IsString()
  dueDate: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsArray()
  @IsString({ each: true })
  // The { each: true } option tells the validation decorator to run its check on every individual item inside the array, rather than checking the array as a whole.
  @IsOptional()
  labels?: string[];

  @IsString()
  @IsOptional()
  updates?: string;

  @IsMongoId()
  @IsOptional()
  updatedBy?: string;
}
