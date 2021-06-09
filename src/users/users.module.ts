import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from './users.schema';

@Module({
  providers: [UsersController, UsersService],
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UsersSchema }])
  ]
})
export class UsersModule { }
