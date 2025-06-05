import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Beneficiary } from './beneficiary.entity';
@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', nullable: false })
  name: string;
  //realtion
  @OneToMany(() => Beneficiary, (beneficiary) => beneficiary.grade)
  beneficiaries: Beneficiary[];
}
