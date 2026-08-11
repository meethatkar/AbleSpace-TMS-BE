import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('guest')
  async create() {
    const guestUser = await this.authService.create();

    const payload = {
      sub: guestUser._id,
      role: guestUser.role,
      username: guestUser.username,
    };

    const access_token = await this.jwtService.signAsync(payload);
    return {
      message: 'Guest loggedIn successfully',
      access_token: access_token,
      user: guestUser,
    };
  }
  @Post('googleAuth')
  async googleAuth(@Body('token') token: string) {
    const userData = await this.authService.googleLogin(token);
    const payload = {
      sub: userData._id,
      role: userData.role,
      username: userData.username,
    };

    const access_token = await this.jwtService.signAsync(payload);
    return {
      message: 'Google Auth Login successfully',
      access_token: access_token,
      user: userData,
    };
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
