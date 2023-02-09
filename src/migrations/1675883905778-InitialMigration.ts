import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1675883905778 implements MigrationInterface {
    name = 'InitialMigration1675883905778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`images\` (\`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`image_path\` varchar(255) NOT NULL, \`campaign_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`campaigns\` (\`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, \`from\` datetime NOT NULL, \`to\` datetime NOT NULL, \`total_budget\` float NOT NULL, \`daily_budget\` float NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`images\` ADD CONSTRAINT \`FK_3d61570bf12f6d36fb99d5a3b39\` FOREIGN KEY (\`campaign_id\`) REFERENCES \`campaigns\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_3d61570bf12f6d36fb99d5a3b39\``);
        await queryRunner.query(`DROP TABLE \`campaigns\``);
        await queryRunner.query(`DROP TABLE \`images\``);
    }

}
