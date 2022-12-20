import { instanceToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AddBillsInTransactionService } from '@modules/transactions/services/AddBillsInTransactionService';

export class TransactionAddBillsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { transaction_id } = req.params;

    const billFilesPath = ((req.files as Express.Multer.File[]) || []).map(
      (file: Express.Multer.File) => file.filename,
    );

    const transactionAddBills = container.resolve(AddBillsInTransactionService);

    const transaction = await transactionAddBills.execute({
      transaction_id,
      billFilesPath,
    });

    return res.json(instanceToInstance(transaction));
  }
}
