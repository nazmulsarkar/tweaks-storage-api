import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersSchema } from '../users/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  providers: [UsersService, AuthService, LocalStrategy, JwtStrategy],
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UsersSchema }]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '72h' }
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule { }
