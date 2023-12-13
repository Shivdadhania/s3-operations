import { Module } from '@nestjs/common';
import { S3OperationsService } from './s3-operations.service';
import { S3OperationsController } from './s3-operations.controller';
import { AwsS3ConfigModule } from 'src/aws-s3-config/aws-s3-config.module';
import { AwsS3ConfigProvider } from 'src/aws-s3-config/aws-s3-config.provider';
import { UploadFilesRepository } from 'src/db/repo/upload-files';

@Module({
  imports: [AwsS3ConfigModule],
  controllers: [S3OperationsController],
  providers: [S3OperationsService, AwsS3ConfigProvider, UploadFilesRepository],
})
export class S3OperationsModule {}
