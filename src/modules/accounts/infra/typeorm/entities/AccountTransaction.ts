import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Transaction } from '@modules/transactions/infra/typeorm/entities/Transaction';

import { Account } from './Account';

@Entity('account_transactions')
export class AccountTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  account_id: string;

  @Column()
  transaction_id: string;

  @ManyToOne(() => Account, account => account.accountTransactions)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => Transaction, transaction => transaction.accountTransactions)
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @Column('float')
  value: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
