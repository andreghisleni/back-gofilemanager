import { DataSource } from 'typeorm';
import { setDataSource } from 'typeorm-extension';
import 'dotenv/config';

export const createConnection = async (
  database: string = process.env.POSTGRES_DB || 'gofilemanager',
): Promise<DataSource> => {
  try {
    const folder = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
    const ssl =
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : undefined;

    const dataSource = new DataSource({
      name: database,
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5433,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASS || 'docker',
      database,
      ssl,
      entities: [`./${folder}/modules/**/infra/typeorm/entities/*{.js,.ts}`],
      migrations: [
        `./${folder}/shared/infra/typeorm/migrations/general/*{.js,.ts}`,
      ],
      logging: true,
    });

    await dataSource.initialize();

    setDataSource(dataSource);

    return dataSource;
    // eslint-disable-next-line
  } catch (error: any) {
    if (error.message === `database "${database}" does not exist`) {
      console.log(database);// eslint-disable-line
      console.log(error.message);// eslint-disable-line
    }
    throw new Error(error.message);
  }
};
