import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionsBeneficiaries } from './questions-beneficiaries.entity';
@Entity('areas_asesories')

export class AreasAsesories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column()
  description: string

  //other relations
  @Column({ type: 'boolean', name: 'is_active', nullable: true })
  isActive: boolean;

  @OneToMany(() => QuestionsBeneficiaries, (questions_beneficiaries) => questions_beneficiaries.areaAsesory)
  question: QuestionsBeneficiaries[];
}
