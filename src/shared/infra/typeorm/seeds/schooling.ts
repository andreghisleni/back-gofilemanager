// import { Schooling } from '@modules/schooling/infra/typeorm/entities/Schooling';
import { getRepository } from 'typeorm';
import { createConnections } from 'typeorm';

import { Transaction } from '@modules/transactions/infra/typeorm/entities/Transaction';

// import data from './data/schooling';

(async () => {
  await createConnections();
  const ormRepository = getRepository(Transaction);

  // const states = ormRepository.create(data);

  // await ormRepository.save(states);
  console.log(await ormRepository.find());
})();
