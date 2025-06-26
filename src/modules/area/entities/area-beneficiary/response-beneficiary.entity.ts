import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Beneficiary } from '../../../beneficiary/entities/beneficiary.entity';
import { QuestionBeneficiaries } from './question-beneficiaries.entity';
@Entity('response_beneficiaries')
export class ResponseBeneficiary {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(
    () => QuestionBeneficiaries,
    (questionBeneficiaries) => questionBeneficiaries.responseBeneficiary,
  )
  @JoinColumn({ name: 'question_id' })
  questionBeneficiaries: QuestionBeneficiaries;
  @ManyToOne(
    () => Beneficiary,
    (beneficiary) => beneficiary.responseBeneficiary,
  )
  @JoinColumn({ name: 'beneficiary_id' })
  beneficiary: Beneficiary;
  @Column({ type: 'varchar', length: 500, nullable: true })
  response: string;
}
