import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service.js';
//import { diskStorage, type Multer } from 'multer';
import * as multer from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFiler } from './helpers/fileFilter.helper.js';
import { fileNamer } from './helpers/fileNamer.helper.js';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';



@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configServie: ConfigService
  ) {}


  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile(path);
  }

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

    const secureUrl = `${this.configServie.get('HOST_API')}/files/product/${file.filename}`;

    return {secureUrl}
  }
}
