import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('Token missing');

    const token = authHeader.split(' ')[1];
    console.log('Extracted Token:', token);
    try {
      request.user = this.jwtService.verify(token);
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
