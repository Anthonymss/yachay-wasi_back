import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyEntities1749498040310 implements MigrationInterface {
  name = 'ModifyEntities1749498040310';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`area_staff\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`description\` varchar(255) NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`languajes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`beneficiary_languages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`language_id\` int NULL, \`beneficiary_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`schedules_beneficiaries\` (\`id\` int NOT NULL AUTO_INCREMENT, \`day_of_week\` enum ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL, \`period_time\` varchar(255) NOT NULL, \`period_time2\` varchar(255) NOT NULL, \`period_time3\` varchar(255) NOT NULL, \`beneficiary_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`areas_asesories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`is_active\` tinyint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`questions_beneficiaries\` (\`id\` int NOT NULL AUTO_INCREMENT, \`question_text\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`area_asesory_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`response_beneficiaries\` (\`id\` int NOT NULL AUTO_INCREMENT, \`response\` varchar(500) NULL, \`question_id\` int NULL, \`beneficiary_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`grades\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`enrollment_status\` (\`id\` int NOT NULL AUTO_INCREMENT, \`description\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`learning_levels\` (\`id\` int NOT NULL AUTO_INCREMENT, \`description\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`beneficiaries\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NULL, \`last_name\` varchar(50) NULL, \`dni\` varchar(30) NOT NULL, \`institution\` varchar(150) NULL, \`birth_date\` varchar(100) NULL, \`sex\` enum ('male', 'female', 'other') NULL, \`representativeName\` varchar(50) NULL, \`representative_last_name\` varchar(50) NULL, \`phone_number\` varchar(15) NULL, \`phone_emergency\` varchar(15) NULL, \`add_group_wspp\` varchar(100) NULL, \`itEquipment\` varchar(100) NULL, \`featured_course\` varchar(100) NULL, \`comunication_media\` varchar(100) NULL, \`upload_audio_allpa\` varchar(100) NULL, \`upload_audio_ruru\` varchar(100) NULL, \`observations\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`grade_id\` int NULL, \`enrollment_status_id\` int NULL, \`learning_level_id\` int NULL, \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`refresh_tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`isRevoked\` tinyint NOT NULL DEFAULT 0, \`expiresAt\` datetime NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NULL, \`last_name\` varchar(100) NULL, \`phone_number\` varchar(15) NULL, \`email\` varchar(100) NOT NULL, \`password\` varchar(100) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, \`rol_id\` int NULL, \`sub_area_id\` int NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`sub_areas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`description\` varchar(100) NULL, \`is_active\` tinyint NULL DEFAULT 1, \`area_staff_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`questions_volunteers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`question_text\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`sub_area_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`response_volunteers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`response\` varchar(500) NULL, \`question_id\` int NULL, \`volunteer_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`schedules_volunteers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`day_of_week\` enum ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL, \`period_time\` varchar(255) NOT NULL, \`period_time2\` varchar(255) NOT NULL, \`period_time3\` varchar(255) NOT NULL, \`volunteer_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`volunteers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NULL, \`last_name\` varchar(50) NULL, \`birth_date\` varchar(100) NULL, \`phone_number\` varchar(30) NOT NULL, \`email\` varchar(100) NULL, \`type_identification\` enum ('DNI', 'PASSPORT') NOT NULL DEFAULT 'DNI', \`num_identification\` varchar(100) NULL, \`is_active\` tinyint NOT NULL DEFAULT 0, \`was_voluntary\` tinyint NOT NULL DEFAULT 1, \`cv_url\` varchar(255) NOT NULL, \`date_postulation\` date NOT NULL, \`volunteer_motivation\` varchar(500) NULL, \`type_volunteer\` enum ('STAFF', 'ADVISER') NOT NULL DEFAULT 'STAFF', \`howDidYouFindUs\` enum ('Facebook', 'Instagram', 'LinkedIn', 'TikTok', 'Correo electrónico', 'Boletín UTEC', 'Proa', 'Pronabec', 'Referencia de un amigo/familia') NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`donations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`email\` varchar(100) NOT NULL, \`amount\` int NOT NULL, \`currency\` varchar(255) NOT NULL, \`donationType\` varchar(255) NOT NULL, \`paymentMethod\` varchar(255) NOT NULL, \`date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`message\` varchar(500) NULL, \`status\` varchar(255) NOT NULL, \`receiptUrl\` varchar(255) NOT NULL, \`is_anonymous\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`beneficiary_languages\` ADD CONSTRAINT \`FK_7affcbaf9b34e21beae83200af3\` FOREIGN KEY (\`language_id\`) REFERENCES \`languajes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`beneficiary_languages\` ADD CONSTRAINT \`FK_df39f7377df6229bff44a20b6d6\` FOREIGN KEY (\`beneficiary_id\`) REFERENCES \`beneficiaries\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`schedules_beneficiaries\` ADD CONSTRAINT \`FK_55ff8aa340e4333d251dfaa9641\` FOREIGN KEY (\`beneficiary_id\`) REFERENCES \`beneficiaries\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`questions_beneficiaries\` ADD CONSTRAINT \`FK_34e25ee7e04b1612f63acc4dcce\` FOREIGN KEY (\`area_asesory_id\`) REFERENCES \`areas_asesories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`response_beneficiaries\` ADD CONSTRAINT \`FK_66e1aeaf071a5edd3676b074f87\` FOREIGN KEY (\`question_id\`) REFERENCES \`questions_beneficiaries\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`response_beneficiaries\` ADD CONSTRAINT \`FK_05dd6ece18f9a36d627ea0f7329\` FOREIGN KEY (\`beneficiary_id\`) REFERENCES \`beneficiaries\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`beneficiaries\` ADD CONSTRAINT \`FK_c331a9d5cee198cbfea601030bc\` FOREIGN KEY (\`grade_id\`) REFERENCES \`grades\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`beneficiaries\` ADD CONSTRAINT \`FK_bb61239203fa9b1870f6d362ae3\` FOREIGN KEY (\`enrollment_status_id\`) REFERENCES \`enrollment_status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`beneficiaries\` ADD CONSTRAINT \`FK_da93f527bc7e79770a8540f7533\` FOREIGN KEY (\`learning_level_id\`) REFERENCES \`learning_levels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`beneficiaries\` ADD CONSTRAINT \`FK_38906de3393c7787c3c89e29d3b\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_tokens\` ADD CONSTRAINT \`FK_3ddc983c5f7bcf132fd8732c3f4\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_685cb01ac5c88b5abb6bbe8aa60\` FOREIGN KEY (\`rol_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD CONSTRAINT \`FK_30c9c0efb7108c969efd77b3d4f\` FOREIGN KEY (\`sub_area_id\`) REFERENCES \`sub_areas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sub_areas\` ADD CONSTRAINT \`FK_fb54429ed895015ae045b0932d1\` FOREIGN KEY (\`area_staff_id\`) REFERENCES \`area_staff\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`questions_volunteers\` ADD CONSTRAINT \`FK_87ca1ec0e46f9cb5a90352e4a3b\` FOREIGN KEY (\`sub_area_id\`) REFERENCES \`sub_areas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`response_volunteers\` ADD CONSTRAINT \`FK_449937d7abdd26d2c269b182062\` FOREIGN KEY (\`question_id\`) REFERENCES \`questions_volunteers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`response_volunteers\` ADD CONSTRAINT \`FK_99eb5cb3b2c12f6f43ac414f2c7\` FOREIGN KEY (\`volunteer_id\`) REFERENCES \`volunteers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`schedules_volunteers\` ADD CONSTRAINT \`FK_73fbaa5bb2797c8b4aefb29573e\` FOREIGN KEY (\`volunteer_id\`) REFERENCES \`volunteers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`schedules_volunteers\` DROP FOREIGN KEY \`FK_73fbaa5bb2797c8b4aefb29573e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`response_volunteers\` DROP FOREIGN KEY \`FK_99eb5cb3b2c12f6f43ac414f2c7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`response_volunteers\` DROP FOREIGN KEY \`FK_449937d7abdd26d2c269b182062\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`questions_volunteers\` DROP FOREIGN KEY \`FK_87ca1ec0e46f9cb5a90352e4a3b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sub_areas\` DROP FOREIGN KEY \`FK_fb54429ed895015ae045b0932d1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_30c9c0efb7108c969efd77b3d4f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_685cb01ac5c88b5abb6bbe8aa60\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_tokens\` DROP FOREIGN KEY \`FK_3ddc983c5f7bcf132fd8732c3f4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`beneficiaries\` DROP FOREIGN KEY \`FK_38906de3393c7787c3c89e29d3b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`beneficiaries\` DROP FOREIGN KEY \`FK_da93f527bc7e79770a8540f7533\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`beneficiaries\` DROP FOREIGN KEY \`FK_bb61239203fa9b1870f6d362ae3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`beneficiaries\` DROP FOREIGN KEY \`FK_c331a9d5cee198cbfea601030bc\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`response_beneficiaries\` DROP FOREIGN KEY \`FK_05dd6ece18f9a36d627ea0f7329\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`response_beneficiaries\` DROP FOREIGN KEY \`FK_66e1aeaf071a5edd3676b074f87\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`questions_beneficiaries\` DROP FOREIGN KEY \`FK_34e25ee7e04b1612f63acc4dcce\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`schedules_beneficiaries\` DROP FOREIGN KEY \`FK_55ff8aa340e4333d251dfaa9641\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`beneficiary_languages\` DROP FOREIGN KEY \`FK_df39f7377df6229bff44a20b6d6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`beneficiary_languages\` DROP FOREIGN KEY \`FK_7affcbaf9b34e21beae83200af3\``,
    );
    await queryRunner.query(`DROP TABLE \`donations\``);
    await queryRunner.query(`DROP TABLE \`volunteers\``);
    await queryRunner.query(`DROP TABLE \`schedules_volunteers\``);
    await queryRunner.query(`DROP TABLE \`response_volunteers\``);
    await queryRunner.query(`DROP TABLE \`questions_volunteers\``);
    await queryRunner.query(`DROP TABLE \`sub_areas\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`refresh_tokens\``);
    await queryRunner.query(`DROP TABLE \`beneficiaries\``);
    await queryRunner.query(`DROP TABLE \`learning_levels\``);
    await queryRunner.query(`DROP TABLE \`enrollment_status\``);
    await queryRunner.query(`DROP TABLE \`grades\``);
    await queryRunner.query(`DROP TABLE \`response_beneficiaries\``);
    await queryRunner.query(`DROP TABLE \`questions_beneficiaries\``);
    await queryRunner.query(`DROP TABLE \`areas_asesories\``);
    await queryRunner.query(`DROP TABLE \`schedules_beneficiaries\``);
    await queryRunner.query(`DROP TABLE \`beneficiary_languages\``);
    await queryRunner.query(`DROP TABLE \`languajes\``);
    await queryRunner.query(`DROP TABLE \`roles\``);
    await queryRunner.query(`DROP TABLE \`area_staff\``);
  }
}
