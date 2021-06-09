import { Body, Controller, HttpStatus, Logger, Post, Request, Response } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { SignupInput } from './dto/signup.input';
import { LoginInput } from './dto/login.input';
import { Public } from 'src/common/decorators/public';

@Controller('/api/auth')
export class AuthController {
    private logger = new Logger(AuthController.name);

    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    @Post('login')
    @Public()
    async login(@Body() body: LoginInput, @Response() res: any): Promise<any> {
        this.logger.log('loginUser called');

        if (!(body && body.email && body.password)) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'Email and password are required!' });
        }
        const user = await this.authService.checkUser(body.email, body.password);

        if (user) {
            return res.status(HttpStatus.OK).json(await this.authService.createToken(user));
        }
        return res.status(HttpStatus.FORBIDDEN).json({ message: 'Email or passwod wrong!' });
    }

    @Post('signup')
    @Public()
    async registerUser(@Response() res: any, @Body() body: SignupInput): Promise<any> {
        this.logger.log('register user called');
        if (!(body && body.email && body.password && body.confirmPassword)) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'Email and password are required!' });
        }

        if (!(body && body.password === body.confirmPassword)) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'Confirm password is miss-matched!' });
        }

        let user;
        try {
            user = await this.usersService.getUserByEmail(body.email);
        } catch (err) {
            this.logger.log('Error in lookup user');
        }

        if (user) {
            return res.status(HttpStatus.FORBIDDEN).json({ message: 'Email already exists!' });
        } else {
            user = await this.usersService.create(body);
            if (user) {
                user.passwordHash = undefined;
            }
        }
        return res.status(HttpStatus.OK).json({ user, message: 'User created successfully!' });
    }

    @Post('me')
    async getUserMe(@Request() req: any, @Response() res: any): Promise<any> {
        const user = req.user;
        return res.status(HttpStatus.OK).json(user);
    }
}