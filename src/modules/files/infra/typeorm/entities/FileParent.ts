import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { File } from './File';

@Entity('fileParents')
export class FileParent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  parent_id: string;

  @Column()
  children_id: string;

  @OneToOne(() => File, file => file.children)
  @JoinColumn({ name: 'parent_id' })
  parent_file: File;

  @OneToOne(() => File, file => file.parent)
  @JoinColumn({ name: 'children_id' })
  children_file: File;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
