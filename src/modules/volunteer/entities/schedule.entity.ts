import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Volunteers } from './volunteers.entity';
export enum DAY {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

@Entity('schedules_volunteers')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: DAY, name: 'day_of_week' })
  dayOfWeek: DAY;

  @ManyToOne(() => Volunteers, (volunteer) => volunteer.schedules)
  @JoinColumn({ name: 'volunteer_id' })
  volunteer: Volunteers;

  @Column()
  period_time: string;

  @Column()
  period_time2: string;

  @Column()
  period_time3: string;
}
