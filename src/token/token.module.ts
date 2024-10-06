import { Global, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [JwtModule.register({
    secret: 'secretKey', // Use an environment variable in production
    signOptions: { expiresIn: '24h' },
  }),],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule { }
