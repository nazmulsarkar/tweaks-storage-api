import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesController } from './files.controller';
import { FilesSchema } from './files.schema';
import { FilesService } from './files.service';
import { StorageService } from './storage.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'File', schema: FilesSchema }])],
  controllers: [FilesController],
  providers: [FilesService, StorageService]
})
export class FilesModule { }
