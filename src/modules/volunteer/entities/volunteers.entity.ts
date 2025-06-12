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
export class Volunteers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 50, name: 'last_name' })
  lastName: string;

  @Column({ type: 'date', name: 'date_birth' })
  date_birth: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    name: 'phone_number',
  })
  phone_number: string;

  @Column({ type: 'varchar', length: 50, name: 'email' })
  email: string;

  @Column({
    type: 'enum',
    enum: TYPE_IDENTIFICATION,
    default: TYPE_IDENTIFICATION.DNI,
    nullable: false,
    name: 'type_identification',
  })
  type_identification: TYPE_IDENTIFICATION;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    name: 'num_identification',
  })
  num_identification: string;

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
    name: 'was_voluntary',
  })
  was_voluntary: boolean;

  @Column({ type: 'varchar', nullable: false, name: 'cv_url' })
  cv_url: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'video_url' })
  video_url: string;

  // DISPONIBILIDAD
  // Estos campos ahora son nullable: true para STAFF
  @Column({
    type: 'enum',
    enum: SchoolGrades,
    nullable: true, // Cambiado a true
    name: 'school_grades'
  })
  school_grades: SchoolGrades;

  @Column({
    type: 'boolean',
    nullable: true,
    name: 'calling_plan'
  })
  calling_plan: boolean;

  // MOTIVACION Y EXPERIENCIA
  @Column({
    type: 'boolean',
    nullable: false,
    name: 'experience'
  })
  experience: boolean;

  @Column({
    type: 'enum',
    enum: Occupation,
    nullable: false,
    name: 'occupation'
  })
  occupation: Occupation;

  // Estos campos ahora son nullable: true para STAFF
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true, // Cambiado a true
    name: 'volunteer_motivation',
  })
  volunteer_motivation: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true, // Cambiado a true
    name: 'why_asesor'
  })
  why_asesor: string;

  @Column({
    type: 'enum',
    enum: QuechuaLevel,
    nullable: true, // Cambiado a true
    name: 'quechua_level'
  })
  quechua_level: QuechuaLevel;

  @Column({
    type: 'enum',
    enum: ProgramsUniversity,
    nullable: false,
    name: 'programs_university'
  })
  programs_university: ProgramsUniversity;

  @Column({
    type: 'enum',
    enum: InfoSource,
    nullable: false,
    name: 'how_did_you_find_us'
  })
  how_did_you_find_us: InfoSource;

  @Column({
    type: 'date',
    nullable: false,
    name: 'date_postulation',
  })
  date_postulation: Date;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
    name: 'is_voluntary',
  })
  is_voluntary: boolean;

  @Column({
    type: 'enum',
    enum: TYPE_VOLUNTEER,
    default: TYPE_VOLUNTEER.STAFF,
    nullable: false,
    name: 'type_volunteer',
  })
  type_volunteer: TYPE_VOLUNTEER;


  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date;

  @Column({ name: 'name_postulation_area', nullable: true })
  name_postulation_area: string;

  // Relaciones
  @OneToMany(
    () => ResponsesVolunteers,
    (responseVolunteer) => responseVolunteer.volunteer,
  )
  responseVolunteer: ResponsesVolunteers[];

  @OneToMany(() => Schedule, (schedule) => schedule.volunteer)
  schedules: Schedule[];
}