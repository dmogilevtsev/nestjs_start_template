import { MigrationInterface, QueryRunner } from 'typeorm'
import { UserEntity } from '../users/user.entity'

export class createTestUser1639259664309 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userEntity = await queryRunner.manager.getRepository(UserEntity)
    userEntity.insert([
      {
        email: 'fitappservice@gmail.com',
        password:
          '$2a$12$nGjKhxGIErha67fiUuSOT.LyBJr7T8DHfnYe1DisnD/J1EqJUSBVu',
        isActivated: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const userEntity = await queryRunner.manager.getRepository(UserEntity)
    userEntity.delete({ email: 'fitappservice@gmail.com' })
  }
}
