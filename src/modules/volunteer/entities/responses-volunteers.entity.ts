import { QuestionsVolunteers} from 'src/modules/area/entities/area-volunteer/questions-volunteers.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Volunteers } from './volunteers.entity';

@Entity('responses_volunteers')
export class ResponsesVolunteers {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => QuestionsVolunteers, (question) => question.responseVolunteer)
  @JoinColumn({ name: 'question_id' })
  question: QuestionsVolunteers;

  @ManyToOne(() => Volunteers, (volunteer) => volunteer.responseVolunteer)
  @JoinColumn({ name: 'volunteer_id' })
  volunteer: Volunteers;
  
  @Column({ type: 'varchar', length: 500, nullable: true })
  response: string;
}
