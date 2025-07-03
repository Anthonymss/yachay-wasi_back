import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Beneficiary } from './beneficiary.entity';

export enum LANGUAGES {
  ENGLISH = 'English',
  SPANISH = 'Español',
  QUECHUA = 'Quechua',
  AIMARA = 'Aimara',
  OTHER = 'Otro',
}
@Entity('beneficiary_languages')
export class BeneficiaryLanguage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: LANGUAGES, nullable: false })
  language: LANGUAGES;

  @Column({ type: 'varchar', length: 100, nullable: true })
  customLanguageName?: string;
  @ManyToOne(
    () => Beneficiary,
    (beneficiary) => beneficiary.beneficiaryLanguage,
  )
  @JoinColumn({ name: 'beneficiary_id' })
  beneficiary: Beneficiary;
}
