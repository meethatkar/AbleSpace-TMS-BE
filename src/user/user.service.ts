import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private googleClient: OAuth2Client;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
    );
  }

  async guestLogin() {
    try {
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const guestUser = await this.userModel.create({
        fullName: `Guest User ${randomSuffix}`,
        username: `guest_${randomSuffix}`,
        email: `guest_${randomSuffix}@temp.local`,
        role: 'Guest',
      });

      return guestUser;
    } catch (error) {
      console.log('ERROR: ', error);
      throw error;
    }
  }

  async googleLogin(id: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: id,
        // audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });
      const payload = ticket.getPayload();

      if (!payload || !payload.email) {
        throw new UnauthorizedException('Invaild Google Token');
      }

      const { email, name, picture } = payload;

      let user = await this.userModel.findOne({ email });

      if (!user) {
        const randomSuffix = Math.floor(100 + Math.random() * 900);
        const username = email.split('@')[0] + '_' + randomSuffix;
        user = await this.userModel.create({
          fullName: name || 'Google User ' + randomSuffix,
          username,
          email,
          role: 'User',
          profileImg: picture,
        });
      }

      return user;
    } catch (error) {
      console.log('Error in google Auth: ', error);
      throw error;
    }
  }

  async getUser(req: Request) {
    const id = req.user?.sub;
    if (!id) {
      throw new UnauthorizedException('User ID not found in token');
    }
    try {
      return await this.userModel.findById(id);
    } catch (error) {
      console.log('Error in GetMe: ', error);
      throw error;
    }
  }

  async updateEmail(req: Request, updatedEmail: string) {
    const id = req.user?.sub;
    if (!id) {
      throw new UnauthorizedException('User ID not found in token');
    }
    try {
      return await this.userModel.findByIdAndUpdate(
        id,
        { email: updatedEmail },
        { new: true },
      );
    } catch (error) {
      console.log('Error in updateEmail: ', error);
      throw error;
    }
  }
}
