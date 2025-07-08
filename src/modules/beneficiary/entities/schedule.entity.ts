import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Beneficiary } from './beneficiary.entity';
export enum DAY {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}
@Entity('schedules_beneficiaries')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'enum', enum: DAY, name: 'day_of_week' })
  dayOfWeek: DAY;
  @ManyToOne(() => Beneficiary, (beneficiary) => beneficiary.schedules)
  @JoinColumn({ name: 'beneficiary_id' })
  beneficiary: Beneficiary;
  //
  @Column()
  period_time: string;
  @Column()
  period_time2: string;
  @Column()
  period_time3: string;
  constructor(partial?: Partial<Schedule>) {
    Object.assign(this, partial);
  }
}
