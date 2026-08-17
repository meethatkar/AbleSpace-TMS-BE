import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getMe(@Req() req: Request) {
    return this.userService.getUser(req);
  }
}
