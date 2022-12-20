export interface ICreateTransactionDTO {
  title: string;
  description: string;
  type: 'income' | 'outcome' | 'initvalue';
  value: number;
  bill: string[];
  category_id: string;
}

export interface ICreateExactTransactionDTO extends ICreateTransactionDTO {
  id: string;
  created_at: Date;
  updated_at: Date;
}
