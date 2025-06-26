import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionBeneficiaries } from './question-beneficiaries.entity';
@Entity('areas_asesories')
export class AreaAdviser {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;
  @Column({ type: 'boolean', name: 'is_active', nullable: true })
  isActive: boolean;
  @Column()
  description: string;
  //other relations
  @OneToMany(
    () => QuestionBeneficiaries,
    (questionBeneficiaries) => questionBeneficiaries.areaAdviser,
  )
  questionBeneficiaries: QuestionBeneficiaries[];
}
