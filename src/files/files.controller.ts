import { Controller, HttpStatus, Param, Post, Req, Response, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('api/files')
export class FilesController {
  constructor(
    private filesService: FilesService
  ) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async addSecureFile(@Req() req: any, @UploadedFile() file: Express.Multer.File, @Response() res: any) {
    return res.status(HttpStatus.OK).json(await this.filesService.addSecureFile(req.user, file.buffer, file.originalname));
  }

  @Post('secured/:fileKey')
  async getSecureFile(@Param('fileKey') fileKey: string, @Response() res: any) {
    return res.status(HttpStatus.OK).json(await this.filesService.getSecureFile(fileKey));
  }
}
