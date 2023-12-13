import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3ConfigService {
  constructor(
    @Inject('S3_BUCKET')
    private readonly _client: S3,
    private readonly configService: ConfigService,
  ) {}

  /**
   * return list of buckets
   * @returns
   */
  async listBuckets() {
    const command: any = await this._client.listBuckets().promise();

    return command.Buckets.map((k) => k.Name);
  }

  /**
   * list all obejct names in perticular bucket
   * @param bucket
   * @returns
   */
  async getListsOfObjects(bucket: string) {
    const data = await this._client
      .listObjectsV2({
        Bucket: bucket,
      })
      .promise();
    return data.Contents.map((k) => k.Key);
  }

  /**
   * Upload images on aws s3
   * @param fileBuffer
   * @param filename
   * @param mimetype
   * @returns
   */
  public async s3Upload(
    fileBuffer: any,
    filename: string,
    mimetype: string,
    folderName?: string,
  ) {
    return new Promise(async (resolve, reject) => {
      let bucket;
      if (folderName) {
        bucket =
          this.configService.get<string>('S3_UPLOAD_BUCKET') + folderName;
      } else {
        bucket = this.configService.get<string>('S3_UPLOAD_BUCKET');
      }

      const params = {
        Bucket: bucket,
        Key: String(filename),
        Body: fileBuffer,
        ContentType: mimetype,
        ContentDisposition: 'inline',
      };

      try {
        const { Location, Key } = await this._client.upload(params).promise();
        const fileResponseObject = {
          fileUrl: Location,
          filePath: Key,
        };
        console.log('Location: ', Location);
        console.log('Key: ', Key);
        resolve(fileResponseObject);
      } catch (e) {
        reject(e);
        console.log('imageUpload', e);
      }
    });
  }

  /**
   * It will delete the files from the s3 bucket
   * @param key string
   * @returns Promise<S3.DeletedObject>
   */
  public async deleteFile(
    filePath: string,
    bucket: string,
  ): Promise<S3.DeletedObject> {
    return new Promise((resolve, reject) => {
      this._client.deleteObject(
        {
          Bucket: bucket,
          Key: filePath,
        },
        (err, data) => {
          if (err) reject(err);
          resolve(data);
        },
      );
    });
  }

  /**
   * get object from bucket
   * @param bucket
   * @param key
   * @returns
   */
  public async getObject(bucket: string, key: string) {
    const data: any = await this._client
      .getObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();
    return data;
  }
}
