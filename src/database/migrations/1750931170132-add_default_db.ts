import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultDb1750931170132 implements MigrationInterface {
    name = 'AddDefaultDb1750931170132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "datasource" ADD "isDefault" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "datasource" DROP COLUMN "isDefault"`);
    }

}
