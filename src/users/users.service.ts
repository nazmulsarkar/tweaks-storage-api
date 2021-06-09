import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterUserInput } from './dto/filter-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './interfaces/user.interface';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
    private logger = new Logger(UsersService.name);

    constructor(@InjectModel('User') private userModel: Model<User>) { }

    async create(createInput: any): Promise<User> {
        createInput.password = await this.getHash(createInput.password);
        // clear  password as we don't persist passwords
        createInput.confirmPassword = undefined;
        const createdUser = new this.userModel(createInput);
        return await createdUser.save();
    }

    async findAll(): Promise<User[]> {
        return await this.userModel.find().exec();
    }

    async list(filters: FilterUserInput): Promise<User[]> {
        return this.userModel.find({ ...filters }).exec();
    }

    async findOne(id: string): Promise<User> {
        return await this.userModel.findOne({ _id: id });
    }

    async findOneBy(filters: FilterUserInput): Promise<User> {
        return await this.userModel.findOne(filters).exec();
    }

    async getUserByEmail(email: string): Promise<User> {
        return (await this.userModel.find({ email }))[0];
    }

    async update(id: string, updateInput: UpdateUserInput): Promise<User> {
        return await this.userModel.findByIdAndUpdate(id, updateInput, { new: true });
    }

    async remove(id: string): Promise<User> {
        return await this.userModel.findByIdAndRemove(id);
    }

    private async getHash(password: string | undefined): Promise<string> {
        return argon2.hash(password);
    }

    async compareHash(password: string | undefined, hash: string | undefined): Promise<boolean> {
        try {
            if (await argon2.verify(hash, password)) {
                this.logger.log('verification of user sucessful');
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
