import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UploadFiles } from 'src/db/entities';
import { AppDataSource } from 'src/db/db.config';

@Injectable()
export class UploadFilesRepository extends Repository<UploadFiles> {
  protected connection = AppDataSource;
  constructor(protected dataSource: DataSource) {
    super(UploadFiles, dataSource.createEntityManager());
  }
}
