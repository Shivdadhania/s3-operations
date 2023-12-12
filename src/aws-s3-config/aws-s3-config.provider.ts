import { Provider } from '@nestjs/common';
import { AwsS3ConfigService } from './aws-s3-config.service';
import { ConfigService } from '@nestjs/config';
import { Credentials, S3 } from 'aws-sdk';

export const AwsS3ConfigProvider: Provider = {
  provide: AwsS3ConfigService,
  useFactory: (configService: ConfigService) => {
    const s3 = new S3({
      credentials: new Credentials(
        configService.get<string>('AWS_ACCESS_KEY_ID'),
        configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      ),
      region: configService.get<string>('AWS_S3_REGION'),
    });
    return new AwsS3ConfigService(s3, configService);
  },
  inject: [ConfigService],
};
