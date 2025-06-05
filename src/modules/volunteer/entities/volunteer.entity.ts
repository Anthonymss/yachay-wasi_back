import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ResponseVolunteer } from './response-volunteer.entity';
import { Schedule } from './schedule.entity';

@Entity('volunteers')
export class Volunteer {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'last_name' })
  lastName: string;
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'birth_date' })
  birthDate: string;
  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    name: 'phone_number',
  })
  phoneNumber: string;
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'email' })
  email: string;
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'num_identification',
  })
  numIdentification: string;
  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    name: 'is_active',
  })
  isActive: boolean; //was_voluntary? a que se refier?

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
    name: 'is_voluntary',
  })
  isVoluntary: boolean;
  @Column({ type: 'varchar', nullable: false, name: 'cv_url' })
  cvUrl: string;
  @Column({ type: 'date', nullable: false, name: 'date_postulation' })
  datePostulation: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date;

  //others relations
  @OneToMany(
    () => ResponseVolunteer,
    (responseVolunteer) => responseVolunteer.volunteer,
  )
  responseVolunteer: ResponseVolunteer[];
  @OneToMany(() => Schedule, (schedule) => schedule.volunteer)
  schedules: Schedule[];
}
