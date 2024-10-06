import { Body, Controller, Post, UnauthorizedException, UseGuards, Headers, BadRequestException } from '@nestjs/common';
import { AuthService } from './account.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @Post('login')
    async login(@Body('username') username: string, @Body('password') password: string) {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body('username') username: string, @Body('password') password: string) {
      if (!username || !password) {
        throw new BadRequestException('Username and password are required');
      }
      return this.authService.registerAndLogin(username, password);
    }
}
