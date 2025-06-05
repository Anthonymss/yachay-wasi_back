import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Beneficiary } from './beneficiary.entity';
@Entity('enrollment_status')
export class EnrollmentStatus {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  description: string;
  //relation
  @OneToMany(() => Beneficiary, (beneficiary) => beneficiary.enrollmentStatus)
  beneficiaries: Beneficiary[];
}
