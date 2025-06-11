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

  @ManyToOne(() => AreasStaff)
  @JoinColumn({ name: 'area_staff_id' })
  areaStaff: AreasStaff;

  //others
  @OneToMany(() => QuestionsVolunteers, (question) => question.SubArea)
  question: QuestionsVolunteers[];
  @OneToMany(() => User, (user) => user.subArea)
  user: User[];
}
