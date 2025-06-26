import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AreaAsesory } from './area-asesory.entity';
import { ResponseBeneficiary } from './response-beneficiary.entity';

@Entity('questions_beneficiaries')
export class QuestionBeneficiaries {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', nullable: false, name: 'question_text' })
  questionText: string;
  @Column()
  type: string; //que tipos??

  //other realtions
  @ManyToOne(
    () => AreaAsesory,
    (areaAsesory) => areaAsesory.questionBeneficiaries,
  )
  @JoinColumn({ name: 'area_asesory_id' })
  areaAsesory: AreaAsesory;
  @OneToMany(
    () => ResponseBeneficiary,
    (responseBeneficiary) => responseBeneficiary.questionBeneficiaries,
  )
  responseBeneficiary: ResponseBeneficiary[];
}
