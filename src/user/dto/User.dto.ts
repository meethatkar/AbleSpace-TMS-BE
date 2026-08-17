import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  sub?: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  role: string;

  @IsString()
  profileImg: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}
