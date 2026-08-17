import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getMe(@Req() req: Request) {
    return this.userService.getUser(req);
  }

  @Patch()
  updateEmail(@Req() req: Request, @Body('email') email: string) {
    return this.userService.updateEmail(req, email);
  }
}
