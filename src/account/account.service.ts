import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private tokenService: TokenService
  ) { }


  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    return {
      access_token: this.tokenService.generateToken(user),
    };
  }

  async registerAndLogin(username: string, password: string) {
    const user = await this.userService.register(username, password);
    const payload = { username: user.username, sub: user.id };
    return {
      message: 'User registered successfully',
      username: user.username,
      access_token: this.jwtService.sign(payload),
    };
  }
}