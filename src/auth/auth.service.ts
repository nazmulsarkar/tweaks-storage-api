import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
    private logger = new Logger(AuthService.name);

    constructor(private usersService: UsersService,
        private jwtService: JwtService) { }


    async checkUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneBy({ email });
        if (user && await this.compareHash(pass, user.password)) {
            const { id, email, displayName } = user;
            return { id, email, displayName };
        }
        return null;
    }

    async createToken(jwtPayload: JwtPayload) {
        this.logger.log('create Token');
        const token = await this.jwtService.signAsync(jwtPayload);
        return {
            token
        };
    }

    private async getHash(password: string | undefined): Promise<string> {
        return argon2.hash(password);
    }

    async compareHash(password: string | undefined, hash: string | undefined): Promise<boolean> {
        try {
            if (await argon2.verify(hash, password)) {
                this.logger.log('verification of user successful');
                return true;
            } else {
                this.logger.log('verification failed');
                return false;
            }
        } catch (err) {
            this.logger.log('argon2 error');
            return false;
        }
    }
}
