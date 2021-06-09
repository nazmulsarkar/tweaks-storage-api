import { UsersService } from './users.service';
import { UpdateUserInput } from './dto/update-user.input';
import { FilterUserInput } from './dto/filter-user.input';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { BaseUserInput } from './dto/base-user.input';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('/')
  async createUser(
    @Body('createUserInput') createInput: BaseUserInput,
  ): Promise<User> {
    return this.usersService.create(createInput);
  }

  @Get('/')
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post('/filtered')
  async userList(
    @Body('filters') filters: FilterUserInput,
  ): Promise<User[]> {
    return this.usersService.list(filters);
  }

  @Post('/:id')
  async findUser(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<UpdateUserInput> {
    return this.usersService.update(id, updateUserInput);
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }
}
