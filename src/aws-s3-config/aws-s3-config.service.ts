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
   * It will delete the files from the s3 bucket
   * @param key string
   * @returns Promise<S3.DeletedObject>
   */
  public async deleteFile(
    $key: string,
    bucket: string,
  ): Promise<S3.DeletedObject> {
    return new Promise((resolve, reject) => {
      this._client.deleteObject(
        {
          Bucket: bucket,
          Key: $key.replace(`s3://${bucket}/`, ''),
        },
        (err, data) => {
          if (err) reject(err);
          resolve(data);
        },
      );
    });
  }

  async listBuckets() {
    const command: any = await this._client.listBuckets().promise();

    return command.Buckets.map((k) => k.Name);
  }

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
  public async s3_upload(
    fileBuffer: any,
    filename: string,
    mimetype: string,
    folderName: string,
  ) {
    return new Promise(async (resolve, reject) => {
      let bucket;
      bucket = folderName;

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
}
