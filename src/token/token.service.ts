import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class TokenService {
    constructor(private jwtService: JwtService) { }

    generateToken(user: CreateUserDto) {
        const payload = { username: user.email, sub: user.id };
        return this.jwtService.sign(payload);
    }
}
