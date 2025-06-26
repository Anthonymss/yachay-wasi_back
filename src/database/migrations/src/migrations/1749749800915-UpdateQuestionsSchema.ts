import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateQuestionsSchema1749749800915 implements MigrationInterface {
    name = 'UpdateQuestionsSchema1749749800915'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` DROP FOREIGN KEY \`FK_bfb51e023f978addc7b839d6217\``);
        await queryRunner.query(`ALTER TABLE \`areas_asesories\` DROP COLUMN \`is_active\``);
        await queryRunner.query(`ALTER TABLE \`questions_beneficiaries\` DROP COLUMN \`question_text\``);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` DROP COLUMN \`question_id\``);
        await queryRunner.query(`ALTER TABLE \`areas_asesories\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`areas_asesories\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`areas_asesories\` ADD \`deleted_at\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`questions_beneficiaries\` ADD \`questionText\` varchar(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`questions_beneficiaries\` ADD \`required\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`questions_beneficiaries\` ADD \`options\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`questions_beneficiaries\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`questions_beneficiaries\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`questions_beneficiaries\` ADD \`deleted_at\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` ADD \`deleted_at\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` ADD \`questionId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` ADD \`areaAsesoryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`areas_asesories\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`areas_asesories\` ADD \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`questions_beneficiaries\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`questions_beneficiaries\` ADD \`type\` enum ('TEXT', 'TEXTAREA', 'SELECT', 'RADIO', 'CHECKBOX', 'FILE_UPLOAD', 'NUMBER') NOT NULL DEFAULT 'TEXT'`);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` DROP COLUMN \`response\``);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` ADD \`response\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`volunteers\` CHANGE \`school_grades\` \`school_grades\` enum ('Primaria (3° y 4° grado)', 'Primaria (5° y 6° grado)', 'Secundaria (1°, 2° y 3° grado)') NULL`);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` ADD CONSTRAINT \`FK_75022920cbf5be6f8bc0cd359f0\` FOREIGN KEY (\`questionId\`) REFERENCES \`questions_beneficiaries\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` ADD CONSTRAINT \`FK_e75aa13f74dd9af82d5ca06fdc5\` FOREIGN KEY (\`areaAsesoryId\`) REFERENCES \`areas_asesories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` DROP FOREIGN KEY \`FK_e75aa13f74dd9af82d5ca06fdc5\``);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` DROP FOREIGN KEY \`FK_75022920cbf5be6f8bc0cd359f0\``);
        await queryRunner.query(`ALTER TABLE \`volunteers\` CHANGE \`school_grades\` \`school_grades\` enum ('Primaria (3° y 4° grado)', 'Primaria (5° y 6° grado)', 'Secundaria (1', '2° y 3° grado)') NULL`);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` DROP COLUMN \`response\``);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` ADD \`response\` varchar(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`questions_beneficiaries\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`questions_beneficiaries\` ADD \`type\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`areas_asesories\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`areas_asesories\` ADD \`description\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` DROP COLUMN \`areaAsesoryId\``);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` DROP COLUMN \`questionId\``);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`questions_beneficiaries\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`questions_beneficiaries\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`questions_beneficiaries\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`questions_beneficiaries\` DROP COLUMN \`options\``);
        await queryRunner.query(`ALTER TABLE \`questions_beneficiaries\` DROP COLUMN \`required\``);
        await queryRunner.query(`ALTER TABLE \`questions_beneficiaries\` DROP COLUMN \`questionText\``);
        await queryRunner.query(`ALTER TABLE \`areas_asesories\` DROP COLUMN \`deleted_at\``);
        await queryRunner.query(`ALTER TABLE \`areas_asesories\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`areas_asesories\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` ADD \`question_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`questions_beneficiaries\` ADD \`question_text\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`areas_asesories\` ADD \`is_active\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`responses_beneficiaries\` ADD CONSTRAINT \`FK_bfb51e023f978addc7b839d6217\` FOREIGN KEY (\`question_id\`) REFERENCES \`questions_beneficiaries\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
