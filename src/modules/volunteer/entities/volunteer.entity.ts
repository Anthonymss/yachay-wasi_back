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

export enum TYPE_IDENTIFICATION {
  DNI = 'DNI',
  PASSPORT = 'PASSPORT',
}

export enum TYPE_VOLUNTEER {
  STAFF = 'STAFF',
  ADVISER = 'ADVISER',
}

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
    type: 'enum',
    enum: TYPE_IDENTIFICATION,
    default: TYPE_IDENTIFICATION.DNI,
    nullable: false,
    name: 'type_identification',
  })
  typeIdentification: TYPE_IDENTIFICATION;

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
  isActive: boolean;

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
    name: 'was_voluntary',
  })
  wasVoluntary: boolean;

  @Column({ type: 'varchar', nullable: false, name: 'cv_url' })
  cvUrl: string;

  @Column({
    type: 'date',
    nullable: false,
    name: 'date_postulation',
  })
  datePostulation: Date;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'volunteer_motivation',
  })
  volunteerMotivation: string;

  @Column({
    type: 'enum',
    enum: TYPE_VOLUNTEER,
    default: TYPE_VOLUNTEER.STAFF,
    nullable: false,
    name: 'type_volunteer',
  })
  typeVolunteer: TYPE_VOLUNTEER;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date;

  // Relaciones
  @OneToMany(
    () => ResponseVolunteer,
    (responseVolunteer) => responseVolunteer.volunteer,
  )
  responseVolunteer: ResponseVolunteer[];

  @OneToMany(() => Schedule, (schedule) => schedule.volunteer)
  schedules: Schedule[];
}
