import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createTableUsers1638826548026 implements MigrationInterface {
  // private table = new Table({
  //   name: 'users',
  //   columns: [
  //     {
  //       name: 'id',
  //       type: 'integer',
  //       isPrimary: true,
  //       generationStrategy: 'increment',
  //       isGenerated: true,
  //     },
  //     {
  //       name: 'email',
  //       type: 'string',
  //       isUnique: true,
  //       isNullable: false,
  //     },
  //     {
  //       name: 'password',
  //       type: 'string',
  //     },
  //     {
  //       name: 'phone',
  //       type: 'string',
  //     },
  //     {
  //       name: 'isActivated',
  //       type: 'boolean',
  //     },
  //     {
  //       name: 'activateHash',
  //       type: 'string',
  //     },
  //     {
  //       name: 'firstName',
  //       type: 'string',
  //     },
  //     {
  //       name: 'lastName',
  //       type: 'string',
  //     },
  //     {
  //       name: 'photo',
  //       type: 'string',
  //     },
  //     {
  //       name: 'createdBy',
  //       type: 'string',
  //     },
  //     {
  //       name: 'sex',
  //       type: 'string',
  //     },
  //     {
  //       name: 'role',
  //       type: 'string',
  //     },
  //   ],
  // })

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.createTable(this.table)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.dropTable(this.table)
  }
}
