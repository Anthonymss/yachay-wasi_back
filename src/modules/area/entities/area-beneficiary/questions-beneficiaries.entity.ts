import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AreasAsesories } from './areas-asesories.entity';
import { ResponsesBeneficiaries } from './responses-beneficiaries.entity';
import { ResponsesVolunteers } from '../../../volunteer/entities/responses-volunteers.entity';

export enum QuestionType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  SELECT = 'SELECT',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  FILE_UPLOAD = 'FILE_UPLOAD',
  NUMBER = 'NUMBER'
}

@Entity('questions_beneficiaries')
export class QuestionsBeneficiaries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  questionText: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.TEXT
  })
  type: QuestionType;


  //other realtions
  @ManyToOne(() => AreasAsesories, (areasAsesories) => areasAsesories.questions)
  @JoinColumn({ name: 'area_asesory_id' })
  areaAsesory: AreasAsesories;
  
  @OneToMany(
    () => ResponsesBeneficiaries,
    (responseBeneficiary) => responseBeneficiary.question,
  )
  responseBeneficiary: ResponsesBeneficiaries[];

  @OneToMany(() => ResponsesVolunteers, (responseVolunteer) => responseVolunteer.question)
  responseVolunteer: ResponsesVolunteers[];

  
}
