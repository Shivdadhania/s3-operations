import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('upload_files')
export class UploadFiles {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: bigint;

  @Column({ type: 'varchar', length: 300, nullable: false })
  file_path!: string;

  @Column({ type: 'text', nullable: true })
  message!: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}
