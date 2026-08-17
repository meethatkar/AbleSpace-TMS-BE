// src/auth/auth.middleware.ts
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/user/dto/User.dto';

// Optional: Extend Express Request interface to include 'user'
declare module 'express' {
  export interface Request {
    user?: UserDto;
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    // 1. Check if the Authorization header exists and has the Bearer format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization token missing or malformed',
      );
    }

    // 2. Extract the raw token string
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      // 3. Verify the token using your JWT secret
      const decoded: UserDto = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // 4. Attach decoded user payload (e.g. sub/id, username, role) to the request
      req.user = decoded;

      // 5. Proceed forward to controller/service
      next();
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
