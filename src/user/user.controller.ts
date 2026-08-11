import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('guest')
  async guestLogin() {
    const response = this.userService.guestLogin();
    return response;
  }
}
