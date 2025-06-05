import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BeneficiaryLanguage } from './beneficiary-languaje.entity';
@Entity('languajes')
export class Languaje {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  //relation
  @OneToMany(
    () => BeneficiaryLanguage,
    (beneficiaryLanguage) => beneficiaryLanguage.language,
  )
  beneficiaryLanguage: BeneficiaryLanguage[];
}
