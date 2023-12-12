import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { S3OperationsModule } from './s3-operations/s3-operations.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    S3OperationsModule,
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
