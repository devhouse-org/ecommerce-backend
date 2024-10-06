import { Global, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@Global()
@Module({
  imports: [JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '24h' },
  }),],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule { }
