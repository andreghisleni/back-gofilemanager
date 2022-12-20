import { Expose } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import uploadConfig from '@config/upload';

import { Category } from './Category';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  type: 'income' | 'outcome' | 'initvalue';

  @Column('float')
  value: number;

  @Column('varchar', { array: true, default: '{}' })
  bill: string[];

  @Column()
  category_id: string;

  @ManyToOne(() => Category, category => category.transaction, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'bill_url' })
  getAvatarUrl(): string[] | null {
    if (!this.bill || this.bill.length === 0) {
      return null;
    }
    let base_url = '';
    switch (uploadConfig.driver) {
      case 'disk':
        base_url = `${process.env.APP_API_URL}/files/`;
        break;
      case 's3':
        base_url = `https://${uploadConfig.config.aws.bucket}.s3.${uploadConfig.config.aws.region}.amazonaws.com/`;
        break;
      default:
        return null;
    }

    return this.bill.map(bill => `${base_url}${bill}`);
  }
}
