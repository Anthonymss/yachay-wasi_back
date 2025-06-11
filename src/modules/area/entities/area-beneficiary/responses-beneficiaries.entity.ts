import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Beneficiary } from '../../../beneficiary/entities/beneficiary.entity';
import { QuestionsBeneficiaries } from './questions-beneficiaries.entity';

@Entity('responses_beneficiaries')
export class ResponsesBeneficiaries {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => QuestionsBeneficiaries, (question) => question.responseBeneficiary)

  @JoinColumn({ name: 'question_id' })
  question: QuestionsBeneficiaries;

  @ManyToOne(
    () => Beneficiary,
    (beneficiary) => beneficiary.responseBeneficiary,
  )
  @JoinColumn({ name: 'beneficiary_id' })
  beneficiary: Beneficiary;

  @Column({ type: 'varchar', length: 500, nullable: true })
  response: string;
}
