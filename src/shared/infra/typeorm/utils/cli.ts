/* eslint-disable no-console */

import { exec } from 'child_process';
import minimist from 'minimist'; // eslint-disable-line import/no-extraneous-dependencies

const argv = minimist(process.argv.slice(2));

const option = argv._[0];
const dataSource = argv.d || './src/shared/infra/typeorm/dataSource.ts';
const name = argv.n || 'undefined';

if (!option) {
  console.log(
    'Please, choose an option: \n - migration:create\n - migration:run\n - migration:revert\n - migration:show',
  );
  process.exit(0);
}
if (option === 'migration:create') {
  exec(
    `yarn typeorm-ts-node-esm migration:create ./src/shared/infra/typeorm/migrations/${name}`,
    (_err, stdout, stderr) => {
      console.log(`${stdout}`);
      console.log(`${stderr}`);
    },
  );
} else {
  exec(
    `yarn ts-node -r tsconfig-paths/register node_modules/.bin/typeorm-ts-node-esm ${option} --dataSource=${dataSource}`,
    (_err, stdout, stderr) => {
      console.log(`${stdout}`);
      console.log(`${stderr}`);
    },
  );
}
