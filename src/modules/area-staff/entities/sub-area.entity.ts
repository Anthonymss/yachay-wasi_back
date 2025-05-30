import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AreaStaff } from './area-staff.entity';

@Entity('sub_area')
export class SubArea {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;
  @Column({ type: 'varchar', length: 100, nullable: true })
  description: string;
  //@Column({name:'available_spots'})
  //availableSpots: number;  ?
  @Column({ type: 'boolean', name: 'is_active', nullable: true })
  isActive: boolean;

  @ManyToOne(() => AreaStaff)
  @JoinColumn({ name: 'area_staff_id' })
  areaStaff: AreaStaff;
}
