import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserProjectUniqueConstraint1750356883081 implements MigrationInterface {
    name = 'AddUserProjectUniqueConstraint1750356883081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_5527742558a95839f5e521ada6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6a77ec051ba40e54d6ef05143d"`);
        await queryRunner.query(`ALTER TABLE "datasource" DROP CONSTRAINT "UQ_5527742558a95839f5e521ada64"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_dd12f7d02495b74b35dcd300d0" ON "datasource" ("userId", "projectId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_dd12f7d02495b74b35dcd300d0"`);
        await queryRunner.query(`ALTER TABLE "datasource" ADD CONSTRAINT "UQ_5527742558a95839f5e521ada64" UNIQUE ("projectId")`);
        await queryRunner.query(`CREATE INDEX "IDX_6a77ec051ba40e54d6ef05143d" ON "datasource" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5527742558a95839f5e521ada6" ON "datasource" ("projectId") `);
    }

}
