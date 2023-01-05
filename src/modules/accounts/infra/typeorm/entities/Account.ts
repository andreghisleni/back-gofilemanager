import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { AccountTransaction } from './AccountTransaction';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  balance: number;

  @Column()
  total_transactions: number;

  @OneToMany(
    () => AccountTransaction,
    accountTransaction => accountTransaction.account,
  )
  accountTransactions: AccountTransaction[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
