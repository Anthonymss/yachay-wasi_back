import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Languaje } from './languaje.entity';
import { Beneficiary } from './beneficiary.entity';
@Entity('beneficiary_languages')
export class BeneficiaryLanguage {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Languaje, (language) => language.beneficiaryLanguage)
  @JoinColumn({ name: 'language_id' })
  language: Languaje;
  @ManyToOne(
    () => Beneficiary,
    (beneficiary) => beneficiary.beneficiaryLanguage,
  )
  @JoinColumn({ name: 'beneficiary_id' })
  beneficiary: Beneficiary;
}
