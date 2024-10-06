import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService,private jwtService: JwtService,token: TokenService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(user: any) {
    
  }
}
