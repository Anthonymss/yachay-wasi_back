import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubArea } from './sub-area.entity';
import { ResponseVolunteer } from 'src/modules/volunteer/entities/response-volunteer.entity';
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
export class QuestionVolunteer {
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
  @ManyToOne(() => SubArea, (subarea) => subarea.questionVolunteer)
  @JoinColumn({ name: 'sub_area_id' })
  SubArea: SubArea;

  //other realtions
  @OneToMany(
    () => ResponseVolunteer,
    (responseVolunteer) => responseVolunteer.questionVolunteer,
  )
  responseVolunteer: ResponseVolunteer[];
}
