import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateAccountTriggerValue1672859836715
  // eslint-disable-next-line prettier/prettier
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE OR REPLACE FUNCTION process_insert_in_account_transactions() RETURNS TRIGGER AS $$
        DECLARE

        BEGIN

          UPDATE accounts SET balance = balance + NEW.value, total_transactions = total_transactions + 1 WHERE id = NEW.account_id;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;`,
    );

    await queryRunner.query(
      `CREATE OR REPLACE FUNCTION process_update_in_account_transactions() RETURNS TRIGGER AS $$
        DECLARE

        BEGIN

          UPDATE accounts SET balance = (balance - OLD.value) + NEW.value WHERE id = NEW.account_id;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;`,
    );

    await queryRunner.query(
      `CREATE OR REPLACE FUNCTION process_delete_in_account_transactions() RETURNS TRIGGER AS $$
        DECLARE

        BEGIN

          UPDATE accounts SET balance = balance - OLD.value, total_transactions = total_transactions - 1 WHERE id = OLD.account_id;

          RETURN OLD;
        END;
        $$ LANGUAGE plpgsql;`,
    );

    await queryRunner.query(
      `CREATE TRIGGER tr_insert_in_account_transactions
        AFTER INSERT ON account_transactions
        FOR EACH ROW
        EXECUTE PROCEDURE process_insert_in_account_transactions();`,
    );

    await queryRunner.query(
      `CREATE TRIGGER tr_update_in_account_transactions
        AFTER UPDATE ON account_transactions
        FOR EACH ROW
        EXECUTE PROCEDURE process_update_in_account_transactions();`,
    );

    await queryRunner.query(
      `CREATE TRIGGER tr_delete_in_account_transactions
        BEFORE DELETE ON account_transactions
        FOR EACH ROW
        EXECUTE PROCEDURE process_delete_in_account_transactions();`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER tr_insert_in_account_transactions ON account_transactions`,
    );
    await queryRunner.query(
      `DROP TRIGGER tr_update_in_account_transactions ON account_transactions`,
    );
    await queryRunner.query(
      `DROP TRIGGER tr_delete_in_account_transactions ON account_transactions`,
    );
    await queryRunner.query(
      `DROP FUNCTION process_insert_in_account_transactions();`,
    );
    await queryRunner.query(
      `DROP FUNCTION process_update_in_account_transactions();`,
    );
    await queryRunner.query(
      `DROP FUNCTION process_delete_in_account_transactions();`,
    );
  }
}
