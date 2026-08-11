import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async guestLogin() {
    try {
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const guestUser = await this.userModel.create({
        fullName: `Guest User ${randomSuffix}`,
        username: `guest_${randomSuffix}`,
        email: `guest_${randomSuffix}@temp.local`,
        role: 'Guest',
      });

      const payload = {
        sub: guestUser._id,
        role: guestUser.role,
        username: guestUser.username,
      };

      const token = await this.jwtService.signAsync(payload);
      return {
        message: 'Guest loggedIn successfully',
        access_token: token,
        user: guestUser,
      };
    } catch (error) {
      console.log('ERROR: ', error);
      throw error;
    }
  }
}
