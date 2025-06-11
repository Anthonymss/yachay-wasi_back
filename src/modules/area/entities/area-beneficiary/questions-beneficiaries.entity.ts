import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AreasAsesories } from './areas-asesories.entity';
import { ResponsesBeneficiaries } from './responses-beneficiaries.entity';

@Entity('questions_beneficiaries')

export class QuestionsBeneficiaries {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, name: 'question_text' })
  questionText: string;

  @Column()
  type: string; //que tipos?? no recuerdo pero por algo lo puse 

  //other realtions
  @ManyToOne(() => AreasAsesories, (areasAsesories) => areasAsesories.question)
  @JoinColumn({ name: 'area_asesory_id' })
  areaAsesory: AreasAsesories;
  
  @OneToMany(
    () => ResponsesBeneficiaries,
    (responseBeneficiary) => responseBeneficiary.question,
  )
  responseBeneficiary: ResponsesBeneficiaries[];
}
