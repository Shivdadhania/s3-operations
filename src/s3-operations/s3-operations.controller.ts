import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { S3OperationsService } from './s3-operations.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as path from 'path';

const allowedFileExtensions = ['.jpg', '.jpeg', '.png', 'mp4', 'mp3'];
const fileFilter = (req: any, file: any, callback: any) => {
  const ext = path.extname(file.originalname);
  if (!allowedFileExtensions.includes(ext)) {
    req.fileValidationError = 'Invalid file type';
    return callback(new Error('Invalid file type'), false);
  }
  return callback(null, true);
};

@Controller('s3-operations')
export class S3OperationsController {
  constructor(private readonly s3OperationsService: S3OperationsService) {}

  @Get()
  async getList() {
    return this.s3OperationsService.listBucket();
  }

  @Get('list-objects')
  async getListsOfObjects() {
    return this.s3OperationsService.getListsOfObjects();
  }

  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'icon', maxCount: 1 }], {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
      },
      fileFilter,
    }),
  )
  async create(
    @UploadedFiles()
    file: {
      icon?: any;
    },
  ) {
    return this.s3OperationsService.create(file);
  }
}
