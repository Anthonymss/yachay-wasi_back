import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Beneficiary } from '../../../beneficiary/entities/beneficiary.entity';
import { QuestionsBeneficiaries } from './questions-beneficiaries.entity';
import { AreasAsesories } from './areas-asesories.entity';

@Entity('responses_beneficiaries')
export class ResponsesBeneficiaries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  response: string;

  @ManyToOne(() => QuestionsBeneficiaries, (question) => question.responseBeneficiary)
  question: QuestionsBeneficiaries;

  @ManyToOne(() => AreasAsesories, (area) => area.responseBeneficiary)
  areaAsesory: AreasAsesories;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(
    () => Beneficiary,
    (beneficiary) => beneficiary.responseBeneficiary,
  )
  @JoinColumn({ name: 'beneficiary_id' })
  beneficiary: Beneficiary;
}
