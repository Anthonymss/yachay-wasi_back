import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubAreas } from './sub-areas.entity';
import { ResponsesVolunteers } from 'src/modules/volunteer/entities/responses-volunteers.entity';

export enum QuestionType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  SELECT = 'SELECT',
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  FILE_UPLOAD = 'FILE_UPLOAD',
  NUMBER = 'NUMBER'
}

@Entity('questions_volunteers')
export class QuestionsVolunteers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, name: 'question_text' })
  questionText: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.TEXT
  })
  type: QuestionType;

  @ManyToOne(() => SubAreas, (subarea) => subarea.question)
  
  @JoinColumn({ name: 'sub_area_id' })
  SubArea: SubAreas;

  //other realtions
  @OneToMany(
    () => ResponsesVolunteers,
    (responseVolunteer) => responseVolunteer.question,
  )
  responseVolunteer: ResponsesVolunteers[];
}
