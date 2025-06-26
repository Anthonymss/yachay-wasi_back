import { QuestionVolunteer } from 'src/modules/area/entities/area-volunteer/question-volunteer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Volunteer } from './volunteer.entity';

@Entity('response_volunteers')
export class ResponseVolunteer {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(
    () => QuestionVolunteer,
    (questionVolunteer) => questionVolunteer.responseVolunteer,
  )
  @JoinColumn({ name: 'question_id' })
  questionVolunteer: QuestionVolunteer;
  @ManyToOne(() => Volunteer, (volunteer) => volunteer.responseVolunteer)
  @JoinColumn({ name: 'volunteer_id' })
  volunteer: Volunteer;
  @Column({ type: 'varchar', length: 500, nullable: true })
  response: string;
}
