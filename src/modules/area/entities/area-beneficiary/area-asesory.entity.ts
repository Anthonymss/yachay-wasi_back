import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Question } from './question.entity';
@Entity('areas_asesories')
export class AreaAsesory {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;
  @Column({ type: 'boolean', name: 'is_active', nullable: true })
  isActive: boolean;
  @Column()
  description:string
  //other relations
  @OneToMany(() => Question, (question) => question.areaAsesory)
  question: Question[];
}
