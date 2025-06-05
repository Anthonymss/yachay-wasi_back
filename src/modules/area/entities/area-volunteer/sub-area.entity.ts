import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AreaStaff } from './area-staff.entity';
import { Question } from './question.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity('sub_areas')
export class SubArea {
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

  @ManyToOne(() => AreaStaff)
  @JoinColumn({ name: 'area_staff_id' })
  areaStaff: AreaStaff;

  //others
  @OneToMany(() => Question, (question) => question.SubArea)
  question: Question[];
  @OneToMany(() => User, (user) => user.subArea)
  user: User[];
}
