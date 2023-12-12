import { Test, TestingModule } from '@nestjs/testing';
import { S3OperationsService } from './s3-operations.service';

describe('S3OperationsService', () => {
  let service: S3OperationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3OperationsService],
    }).compile();

    service = module.get<S3OperationsService>(S3OperationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
