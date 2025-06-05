import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Beneficiary } from '../../../beneficiary/entities/beneficiary.entity';
import { Question } from './question.entity';
@Entity('response_beneficiaries')
export class ResponseBeneficiary {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Question, (question) => question.responseBeneficiary)
  @JoinColumn({ name: 'question_id' })
  question: Question;
  @ManyToOne(
    () => Beneficiary,
    (beneficiary) => beneficiary.responseBeneficiary,
  )
  @JoinColumn({ name: 'beneficiary_id' })
  beneficiary: Beneficiary;
  @Column({ type: 'varchar', length: 500, nullable: true })
  response: string;
}
