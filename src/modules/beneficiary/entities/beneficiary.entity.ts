import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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
}
