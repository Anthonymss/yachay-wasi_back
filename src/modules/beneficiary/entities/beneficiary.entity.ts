import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BeneficiaryLanguage } from './beneficiary-languaje.entity';
import { Schedule } from './schedule.entity';
import { ResponseBeneficiary } from '../../area/entities/area-beneficiary/response-beneficiary.entity';
import { Grade } from './grade.entity';
import { EnrollmentStatus } from './enrollment-status.entity';
import { LearningLevel } from './learning-level.entity';
import { User } from 'src/modules/user/entities/user.entity';
export enum Sex {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
@Entity('beneficiaries')
export class Beneficiary {
  @PrimaryGeneratedColumn()
  id: number;
  //relacion user

  //relacion grade

  @Column({ type: 'varchar', length: 50, nullable: true })
  name: string;
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'last_name' })
  lastName: string;
  @Column({ type: 'varchar', length: 30, nullable: false })
  dni: string;
  @Column({ type: 'varchar', length: 150, nullable: true })
  institution: string;
  //@Column({type:'varchar',length:150,nullable:true,name:'modality_student'})
  //modalityStudent: string; ??? string o enum?

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'birth_date' })
  birthDate: string;

  @Column({ type: 'enum', enum: Sex, nullable: true })
  sex: Sex; //ENUM o String??
  //@Column()
  //parentesc:string; ??
  @Column({ type: 'varchar', length: 50, nullable: true })
  representativeName: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'representative_last_name',
  })
  representativeLastName: string;

  @Column({ type: 'varchar', length: 15, nullable: true, name: 'phone_number' })
  phoneNumber: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
    name: 'phone_emergency',
  })
  phoneEmergency: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'add_group_wspp',
  })
  addGroupWspp: string; //?? WhatsApp group?
  //relacion status:enrollment_status

  @Column({ type: 'varchar', length: 100, nullable: true })
  itEquipment: string; //?? IT equipment?
  //relacion with learning levels

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'featured_course',
  })
  featuredCourse: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'comunication_media',
  })
  comunicationMedia: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'upload_audio_allpa',
  })
  uploadAudioAllpa: string; //audio de allpa, su url?

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'upload_audio_ruru',
  })
  uploadAudioRuru: string; //audio del ruru, su url?

  @Column()
  observations: string;

  //consent asesory ,image y ruru que son?

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
  @OneToMany(
    () => ResponseBeneficiary,
    (responseBeneficiary) => responseBeneficiary.beneficiary,
  )
  responseBeneficiary: ResponseBeneficiary[];
  @ManyToOne(() => Grade, (grade) => grade.beneficiaries)
  @JoinColumn({ name: 'grade_id' })
  grade: Grade;
  @ManyToOne(
    () => EnrollmentStatus,
    (enrollmentStatus) => enrollmentStatus.beneficiaries,
  )
  @JoinColumn({ name: 'enrollment_status_id' })
  enrollmentStatus: EnrollmentStatus;
  @ManyToOne(
    () => LearningLevel,
    (learningLevel) => learningLevel.beneficiaries,
  )
  @JoinColumn({ name: 'learning_level_id' })
  learningLevel: LearningLevel;
  @ManyToOne(() => User, (user) => user.beneficiaries)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
