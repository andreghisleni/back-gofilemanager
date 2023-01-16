import { Expose } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import uploadConfig from '@config/upload';

import { User } from '@modules/users/infra/typeorm/entities/User';

import { Action } from './Action';
import { FileParent } from './FileParent';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  fileName: string;

  @Column()
  action_id: string;

  @Column()
  from_id: string;

  @Column()
  to_id: string;

  @Column()
  finished: boolean;

  @ManyToOne(() => Action, action => action.files)
  @JoinColumn({ name: 'action_id' })
  action: Action;

  @OneToOne(() => FileParent, fileParent => fileParent.children_file)
  parent: FileParent;

  @OneToOne(() => FileParent, fileParent => fileParent.parent_file)
  children: FileParent;

  @ManyToOne(() => User, user => user.fromFiles)
  @JoinColumn({ name: 'from_id' })
  from: User;

  @ManyToOne(() => User, user => user.toFiles)
  @JoinColumn({ name: 'to_id' })
  to: User;

  @Expose({ name: 'file_url' })
  getFileUrl(): string | null {
    if (!this.fileName) {
      return null;
    }
    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.fileName}`;
      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.${uploadConfig.config.aws.region}.amazonaws.com/${this.fileName}`;
      default:
        return null;
    }
  }

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
