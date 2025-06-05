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

@Entity('questions_volunteers')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', nullable: false, name: 'question_text' })
  questionText: string;
  @Column()
  type: string; //que tipos??
  @ManyToOne(() => SubArea, (subarea) => subarea.question)
  @JoinColumn({ name: 'sub_area_id' })
  SubArea: SubArea;

  //other realtions
  @OneToMany(
    () => ResponseVolunteer,
    (responseVolunteer) => responseVolunteer.question,
  )
  responseVolunteer: ResponseVolunteer[];
}
