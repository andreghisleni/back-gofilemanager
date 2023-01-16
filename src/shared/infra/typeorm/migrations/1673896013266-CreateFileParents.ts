import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateFileParents1673896013266
  implements MigrationInterface {// eslint-disable-line
  private tableName = 'fileParents';

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
            name: 'parent_id',
            type: 'uuid',
          },
          {
            name: 'children_id',
            type: 'uuid',
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
            name: 'FileParentFile',
            referencedTableName: 'files',
            referencedColumnNames: ['id'],
            columnNames: ['parent_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'FileChildrenFile',
            referencedTableName: 'files',
            referencedColumnNames: ['id'],
            columnNames: ['children_id'],
            onDelete: 'CASCADE',
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
