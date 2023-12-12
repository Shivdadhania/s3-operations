import { Module } from '@nestjs/common';
import { AwsS3ConfigProvider } from './aws-s3-config.provider';
import { S3 } from 'aws-sdk';
import { AwsS3ConfigService } from './aws-s3-config.service';

@Module({
  exports: [AwsS3ConfigService],
  imports: [],
  providers: [
    {
      provide: 'S3_BUCKET',
      useValue: S3,
    },
    AwsS3ConfigService,
    AwsS3ConfigProvider,
  ],
})
export class AwsS3ConfigModule {}
