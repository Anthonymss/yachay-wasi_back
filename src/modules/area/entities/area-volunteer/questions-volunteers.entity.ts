import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubAreas } from './sub-areas.entity';
import { ResponseVolunteer } from 'src/modules/volunteer/entities/response-volunteer.entity';

@Entity('questions_volunteers')
export class QuestionsVolunteers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, name: 'question_text' })
  questionText: string;

  @Column()
  type: string;

  @ManyToOne(() => SubAreas, (subarea) => subarea.question)
  
  @JoinColumn({ name: 'sub_area_id' })
  SubArea: SubAreas;

  //other realtions
  @OneToMany(
    () => ResponseVolunteer,
    (responseVolunteer) => responseVolunteer.question,
  )
  responseVolunteer: ResponseVolunteer[];
}
