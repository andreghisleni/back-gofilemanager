import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateFiles1600910030666 implements MigrationInterface {
  private tableName = 'files';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'fileName',
            type: 'varchar',
          },
          {
            name: 'action_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'from_id',
            type: 'uuid',
          },
          {
            name: 'to_id',
            type: 'uuid',
          },
          {
            name: 'finished',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'FileAction',
            referencedTableName: 'actions',
            referencedColumnNames: ['id'],
            columnNames: ['action_id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FileFrom',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['from_id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FileTo',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['to_id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}

/**
 *   created_at: Date;
 *    updated_at: Date;
 */
