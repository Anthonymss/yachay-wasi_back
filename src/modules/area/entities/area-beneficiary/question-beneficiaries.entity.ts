import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AreaAdviser } from './area-adviser.entity';
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
    () => AreaAdviser,
    (areaAdviser) => areaAdviser.questionBeneficiaries,
  )
  @JoinColumn({ name: 'area_asesory_id' })
  areaAdviser: AreaAdviser;
  @OneToMany(
    () => ResponseBeneficiary,
    (responseBeneficiary) => responseBeneficiary.questionBeneficiaries,
  )
  responseBeneficiary: ResponseBeneficiary[];
}
