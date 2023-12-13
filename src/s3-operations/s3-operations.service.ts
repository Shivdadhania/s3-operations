import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as path from 'path';
import { AwsS3ConfigService } from 'src/aws-s3-config/aws-s3-config.service';
import { UploadFilesRepository } from 'src/db/repo/upload-files/upload-files.repo';

@Injectable()
export class S3OperationsService {
  constructor(
    private readonly awsS3ConfigService: AwsS3ConfigService,
    private readonly configService: ConfigService,
    private readonly uploadFilesRepository: UploadFilesRepository,
  ) {}

  /**
   * Get new file name.
   * @param file
   * @returns newFilename
   */
  private getNewFileName(file: any) {
    const name = file.originalname.replace(/\s+/g, '').split('.')[0];
    const ext = path.extname(file.originalname);
    const randomName = Array(6)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    const newFilename = `${name}_${randomName}${ext}`;
    console.log('newFilename', newFilename);
    return newFilename;
  }

  /**
   * it will upload icon & banne_image file to s3
   * @param file
   * @returns
   */
  private async uploadImageS3(file: { icon?: any }) {
    let iconPath;

    if (file?.icon) {
      iconPath = await this.awsS3ConfigService.s3Upload(
        file.icon[0].buffer,
        this.getNewFileName(file.icon[0]),
        file.icon[0].mimetype,
      );
    }

    return {
      iconPath:
        this.configService.get<string>('S3_UPLOAD_BUCKET') +
        '/' +
        iconPath?.filePath,
    };
  }

  /**
   * get single object from bucket
   * @param filePath
   * @param res
   */
  async getObject(filePath: string, res: Response) {
    try {
      const data: any = await this.awsS3ConfigService.getObject(
        this.configService.get('S3_UPLOAD_BUCKET'),
        filePath,
      );
      res.set('Content-Type', data.ContentType);
      res.send(data.Body);
    } catch (error) {
      throw error;
    }
  }

  /**
   * list of all buckets
   * @returns
   */
  async listBucket() {
    try {
      return this.awsS3ConfigService.listBuckets();
    } catch (error) {
      throw error;
    }
  }

  /**
   * get list of object from all buckets
   * @returns
   */
  async getListsOfObjects() {
    try {
      let obj = {};
      const buckets = await this.awsS3ConfigService.listBuckets();
      for (let i = 0; i < buckets.length; i++) {
        obj[buckets[i]] = await this.awsS3ConfigService.getListsOfObjects(
          buckets[i],
        );
      }
      return obj;
    } catch (error) {
      throw error;
    }
  }

  /**
   * upload file to s3
   * @param file
   * @returns
   */
  async create(file: { icon?: any }) {
    try {
      const filePath = await this.uploadImageS3(file);
      return this.uploadFilesRepository.save({
        file_path: filePath.iconPath,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * delete file from s3
   * @param filePath
   */
  async deleteFile(filePath: string) {
    try {
      await this.awsS3ConfigService.deleteFile(
        filePath,
        this.configService.get<string>('S3_UPLOAD_BUCKET'),
      );
      await this.uploadFilesRepository.delete({
        file_path:
          this.configService.get<string>('S3_UPLOAD_BUCKET') + '/' + filePath,
      });
      return;
    } catch (error) {
      throw error;
    }
  }
}
