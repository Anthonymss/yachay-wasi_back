import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { BeneficiaryLanguage } from './beneficiary-languaje.entity';
import { Schedule } from './schedule.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { BeneficiaryPreferredCourses } from './beneficiary-preferred-courses.entity';
import { CommunicationPreference } from './communication-preference.entity';
import { AreaAdviser } from 'src/modules/area/entities/area-beneficiary/area-adviser.entity';
export enum Sex {
  MALE = 'male',
  FEMALE = 'female',
}

export enum ModalityStudent {
  RENOVATION = 'Renovación',
  NEWSTUDENT = 'Nuevo Estudiante',
}
export enum Parentesco {
 MOTHER = 'Mama',
 FATHER = 'Papa',
 GRANDMOTHER = 'Nana',
 GRANDFATHER = 'Nino',
 AUNT = 'Tia',
 UNCLE = 'Tio',
 BROTHER = 'Hermano',
 SISTER = 'Hermana',
}
export enum LearningLevel {
 C='No tan bien',
 B='Mas o menos',
 A='Bien',
 D='Muy bien',
}
export enum Area {
 ARTE_CULTURA='Arte & Cultura',
 BIENESTAR_PSICOLOGICO='Bienestar Psicológico',
 ASESORIA_COLEGIOS_NACIONALES='Asesoría Colegios Nacionales',
}
export enum CoursePriorityReason {
  DIFFICULTY = 'Son los cursos en los que el estudiante presenta más dificultades',
  BASIC_REINFORCEMENT = "Son cursos 'prioritarios' o básicos a reforzar",
  STUDENT_INTEREST = 'Los cursos son de interés para el estudiante',
}
export enum CallSignalIssue {
  EXTERNAL_ISSUES = 'Señal baja debido a situaciones externas: lluvias, cortes de luz repentinos, etc.',
  FREQUENT_ISSUES = 'Señal baja cotidianamente: regularmente no se escucha las llamadas, a veces se corta, no entra la llamada, etc.',
  NO_ISSUES = 'No tiene problemas con la señal.',
}
//temporal
export enum WorkshopPreference {
  STORYTELLING = 'Cuenta cuentos (sin internet)',
  DRAWING_PAINTING = 'Dibujo y Pintura (con internet)',
  MUSIC = 'Música (con internet)',
  ORATORY = 'Oratoria (sin internet)',
  THEATER = 'Teatro (con internet)',
  DANCE = 'Danza (con internet)',
}

export enum Course {
  MATHEMATICS = 'Matemática',
  COMMUNICATION = 'Comunicación',
  ENGLISH = 'Inglés',
}

@Unique(['dni','code'])
@Entity('beneficiaries')
export class Beneficiary {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 50, nullable: false })
  code: string;
  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'last_name' })
  lastName: string;
  @Column({ type: 'varchar', length: 30, nullable: false })
  dni: string;
  @Column({ type: 'varchar', length: 150, nullable: true })
  institution: string;
  @Column({ type: 'enum', enum: ModalityStudent, nullable: true })
  modalityStudent: ModalityStudent;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'birth_date' })
  birthDate: string;

  @Column({ type: 'enum', enum: Sex, nullable: true })
  sex: Sex; 
  @Column({ type: 'enum', enum: Parentesco, nullable: true })
  parentesco: Parentesco;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'name_representative' })
  nameRepresentative: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'last_name_representative',
  })
  lastNameRepresentative: string;

  @Column({ type: 'boolean', nullable: true, name: 'is_add_group_wspp' })
  isAddGroupWspp: boolean;
  //sobre el aprendisaje del estudiante
  @Column({ type: 'boolean', nullable: true, name: 'is_add_equipment' })
  isAddEquipment: boolean;

  @Column({ type: 'enum', enum: LearningLevel, nullable: true })
  learningLevel: LearningLevel;

  @OneToMany(() => BeneficiaryPreferredCourses, (beneficiaryPreferredCourses) => beneficiaryPreferredCourses.beneficiary)
  beneficiaryPreferredCourses: BeneficiaryPreferredCourses[];  
  //Sobre las asesorías al estudiante
  //dto@Column({ type: 'enum', enum: Area, nullable: true })
  //dto //area: Area;  
  @ManyToMany(() => AreaAdviser, (areaAdviser) => areaAdviser.beneficiaries)
  @JoinTable({
    name: 'beneficiary_area_adviser',
    joinColumn: { name: 'beneficiary_id' },
    inverseJoinColumn: { name: 'area_adviser_id' },
  })
  areaAdvisers: AreaAdviser[];  
  @ManyToMany(() => CommunicationPreference, (communicationPreference) => communicationPreference.beneficiaries)
  @JoinTable({
    name: 'beneficiary_communication_preference',
    joinColumn: { name: 'beneficiary_id' },
    inverseJoinColumn: { name: 'communication_preference_id' },
  })
  communicationPreferences: CommunicationPreference[];      
  
  @Column({ type: 'int', nullable: true, name: 'hours_asesoria' })
  hoursAsesoria: number; 

  @Column({ type: 'enum', enum: CoursePriorityReason, nullable: true, name: 'course_priority_reason' })
  coursePriorityReason: CoursePriorityReason;

  @Column({ type: 'varchar', length: 15, nullable: true, name: 'phone_number_main' })
  phoneNumberMain: string;

  @Column({ type: 'text', nullable: true, name: 'cellphone_observation' })
  cellphoneObservation?: string;

  @Column({ type: 'boolean', nullable: true, name: 'is_whatsapp' })
  isWhatsApp: boolean;

  @Column({ type: 'enum', enum: CallSignalIssue, nullable: true, name: 'call_signal_issue' })
  callSignalIssue: CallSignalIssue;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'full_name_contact_emergency' })
  fullNameContactEmergency: string;


  @Column({ type: 'varchar', length: 15, nullable: true, name: 'phone_number_contact_emergency' })
  phoneNumberContactEmergency: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'full_name_contact_emergency2' })
  fullNameContactEmergency2: string;

  @Column({ type: 'varchar', length: 15, nullable: true, name: 'phone_number_contact_emergency2' })
  phoneNumberContactEmergency2: string;


  //Consentimientos
  @Column({ type: 'boolean', nullable: true, name: 'allpa_advisory_consent' })
  allpaAdvisoryConsent: boolean;
  
  @Column({ type: 'boolean', nullable: true, name: 'allpa_image_consent' })
  allpaImageConsent: boolean;
  
  @Column({ type: 'boolean', nullable: true, name: 'ruru_advisory_consent' })
  ruruAdvisoryConsent: boolean;

  @Column({ type: 'text', nullable: true, name: 'additional_notes' })
  additionalNotes?: string;



  //Respuestas dinamicas en base a areas, por ahora asi
  //para arte y cultura
  @Column({ type: 'enum', enum: WorkshopPreference, nullable: true })
  firstWorkshopChoice?: WorkshopPreference;

  @Column({ type: 'enum', enum: WorkshopPreference, nullable: true })
  secondWorkshopChoice?: WorkshopPreference;

  @Column({ type: 'enum', enum: WorkshopPreference, nullable: true })
  thirdWorkshopChoice?: WorkshopPreference;

  // Cursos (si se eligió "Asesoría Académica")
  @Column({ type: 'enum', enum: Course, nullable: true })
  firstCourseChoice?: Course;

  @Column({ type: 'enum', enum: Course, nullable: true })
  secondCourseChoice?: Course;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date;

  //others relations
  @OneToMany(
    () => BeneficiaryLanguage,
    (beneficiaryLanguage) => beneficiaryLanguage.beneficiary,
  )
  beneficiaryLanguage: BeneficiaryLanguage[];

  @OneToMany(() => Schedule, (schedule) => schedule.beneficiary)
  schedules: Schedule[];
  @ManyToOne(() => User, (user) => user.beneficiaries)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
