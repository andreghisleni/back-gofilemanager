import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { File } from '@modules/files/infra/typeorm/entities/File';

import { UserToken } from './UserToken';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  user: string;

  @Column()
  first_password: boolean;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => UserToken, userToken => userToken.user, {
    // eager: true,
  })
  tokens: UserToken[];

  @OneToMany(() => File, file => file.from)
  fromFiles: File[];

  @OneToMany(() => File, file => file.to)
  toFiles: File[];
}
