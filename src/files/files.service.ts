import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/interfaces/user.interface';
import { FilterFileInput } from './dto/filter-file.input';
import { File } from './interfaces/file.interface';
import { StorageService } from './storage.service';

@Injectable()
export class FilesService {
  private logger = new Logger(FilesService.name);

  constructor(@InjectModel('File') private fileModel: Model<File>,
    private storageService: StorageService,) { }

  async addSecureFile(user: User, imageBuffer: Buffer, fileName: string) {
    this.logger.log('addSecureFile');
    const uploadResult = await this.storageService.uploadFile(imageBuffer, fileName);
    const newFile = {
      key: uploadResult.Key,
      fileName: fileName,
      owner: {
        id: user.id,
        email: user.email,
        displayName: user.displayName
      }
    };
    const createdFile = new this.fileModel(newFile);
    return await createdFile.save();
  }

  async getSecureFile(fileKey: string) {
    const file = await (await this.findOneBy({ key: fileKey }));
    if (file) {
      const { id, key, owner } = file;
      const url = await this.storageService.generatePreSignedUrl(fileKey);
      return {
        id,
        key,
        owner,
        url
      }
    }
    throw new NotFoundException('User with this id does not exist');
  }

  async findOneBy(filters: FilterFileInput): Promise<File> {
    return await this.fileModel.findOne(filters).exec();
  }
}
