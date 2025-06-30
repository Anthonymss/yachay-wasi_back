import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AreasStaff } from './areas-staff.entity';
import { QuestionsVolunteers } from './questions-volunteers.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity('sub_areas')
export class SubAreas {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;
  @Column({ type: 'varchar', length: 100, nullable: true })
  description: string;
  //@Column({name:'available_spots'})
  //availableSpots: number;  ?
  @Column({ type: 'boolean', name: 'is_active', nullable: true, default: true })
  isActive: boolean;

  // descripción de landing
  @Column({ type: 'varchar', length: 255, nullable: true})
  volunteerTime: string;

  @Column({ type: 'text', nullable: true})
  functions: String; // guardaremos lista separada por saltos de línea

  @Column({ type: 'text', nullable: true})
  knowledgeAndStudies: string;

  @Column({ type: 'text', nullable: true})
  technologicalSkills: string;

  @Column({ type: 'text', nullable: true})
  additionalKnowledge: string;

  @Column({ type: 'text', nullable: true})
  communicationSkills: string;

  @Column({ type: 'text', nullable: true})
  experience: string;
// **************************************

  @ManyToOne(() => AreasStaff)
  @JoinColumn({ name: 'area_staff_id' })
  areaStaff: AreasStaff;

  //others
  @OneToMany(() => QuestionsVolunteers, (question) => question.SubArea)
  question: QuestionsVolunteers[];
  @OneToMany(() => User, (user) => user.subArea)
  user: User[];
}
