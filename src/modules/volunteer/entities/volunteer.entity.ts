import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ResponsesVolunteers } from './responses-volunteers.entity';
import { Schedule } from './schedule.entity';

export enum TYPE_IDENTIFICATION {
  DNI = 'DNI',
  PASSPORT = 'PASSPORT',
}

export enum TYPE_VOLUNTEER {
  STAFF = 'STAFF',
  ADVISER = 'ADVISER',
}
export enum InfoSource {
  FACEBOOK = 'Facebook',
  INSTAGRAM = 'Instagram',
  LINKEDIN = 'LinkedIn',
  TIKTOK = 'TikTok',
  EMAIL = 'Correo electrónico',
  UTEC_NEWSLETTER = 'Boletín UTEC',
  PROA = 'Proa',
  PRONABEC = 'Pronabec',
  REFERRAL = 'Referencia de un amigo/familia',
}
export enum SchoolGrades {
  PRIMARIA34 = 'Primaria (3° y 4° grado)',
  PRIMARIA56 = 'Primaria (5° y 6° grado)',
  SECUNDARIA123 = 'Secundaria (1°, 2° y 3° grado)'
}
export enum Occupation {
  ESTUDIO = 'Solo estudio',
  TRABAJO = 'Solo trabajo',
  AMBOS = 'Ambos'
}

export enum QuechuaLevel {
  NULO = 'No lo hablo',
  BASICO = 'Nivel básico',
  INTERMEDIO = 'Nivel intermedio',
  AVANZADO = 'Nivel avanzado',
  NATIVO = 'Nativo',
}
export enum ProgramsUniversity {
  PRONABEC = 'Becario Pronabec',
  UNIVAS = 'UNIVAS - UDEP',
  UTEC = 'UTEC',
  UCV = 'UCV',
  NINGUNO = 'Ninguno',
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
  isVoluntary: boolean;

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
  @Column({
    type: 'enum',
    enum: InfoSource,
    nullable: false,
  })
  howDidYouFindUs: InfoSource;
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date;
  //
  @Column({name:'name_postulation_area'})
  namePostulationArea:string;
  // Relaciones
  @OneToMany(
    () => ResponsesVolunteers,
    (responsesVolunteers) => responsesVolunteers.volunteer,
  )
  responseVolunteer: ResponsesVolunteers[];

  @OneToMany(() => Schedule, (schedule) => schedule.volunteer)
  schedules: Schedule[];
}
