import { Test, TestingModule } from '@nestjs/testing';
import { S3OperationsController } from './s3-operations.controller';
import { S3OperationsService } from './s3-operations.service';

describe('S3OperationsController', () => {
  let controller: S3OperationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [S3OperationsController],
      providers: [S3OperationsService],
    }).compile();

    controller = module.get<S3OperationsController>(S3OperationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
