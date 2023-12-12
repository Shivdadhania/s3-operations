import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { AwsS3ConfigService } from 'src/aws-s3-config/aws-s3-config.service';

@Injectable()
export class S3OperationsService {
  constructor(
    private readonly awsS3ConfigService: AwsS3ConfigService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get new file name.
   * @param file
   * @returns newFilename
   */
  private getNewFileName(file: any) {
    const name = file.originalname.replace(/\s+/g, '').split('.')[0];
    console.log('------------------', path);
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
      iconPath = await this.awsS3ConfigService.s3_upload(
        file.icon[0].buffer,
        this.getNewFileName(file.icon[0]),
        file.icon[0].mimetype,
        this.configService.get<string>('S3_UPLOAD_PATH'),
      );
    }

    return {
      iconPath: iconPath?.filePath,
    };
  }

  async listBucket() {
    try {
      return this.awsS3ConfigService.listBuckets();
    } catch (error) {
      throw error;
    }
  }

  async getListsOfObjects() {
    try {
      let obj = {};
      const buckets = await this.awsS3ConfigService.listBuckets();
      console.log('buckets', buckets, buckets.length);
      for (let i = 0; i < buckets.length; i++) {
        console.log('+++++++++++++++++++++++', buckets[i]);
        obj[buckets[i]] = await this.awsS3ConfigService.getListsOfObjects(
          buckets[i],
        );
      }

      console.log('obj', obj);
      return obj;
    } catch (error) {
      throw error;
    }
  }

  async create(file: { icon?: any }) {
    try {
      return this.uploadImageS3(file);
    } catch (error) {
      throw error;
    }
  }
}
