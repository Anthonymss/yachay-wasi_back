import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Beneficiary } from './beneficiary.entity';
@Entity('learning_levels')
export class LearningLevel {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  description: string;

  //relation
  @OneToMany(() => Beneficiary, (beneficiary) => beneficiary.learningLevel)
  beneficiaries: Beneficiary[];
}
