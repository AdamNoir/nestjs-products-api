import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service.js';
//import { diskStorage, type Multer } from 'multer';
import * as multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFiler } from './helpers/fileFilter.helper.js';
import { fileNamer } from './helpers/fileNamer.helper.js';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFiler,
    //limits: {fieldSize: 1000}
    storage: multer.diskStorage({
      destination: './static/uploads',
      filename: fileNamer
    })
  }))
  uploadProductImage(@UploadedFile() file: Express.Multer.File){

    if(!file){
      throw new BadRequestException('File can not be empty')
    }
    return file.originalname;
  }
}
