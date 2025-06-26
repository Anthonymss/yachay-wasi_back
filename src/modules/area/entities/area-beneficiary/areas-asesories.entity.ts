import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { QuestionsBeneficiaries } from './questions-beneficiaries.entity';
import { ResponsesBeneficiaries } from './responses-beneficiaries.entity';

@Entity('areas_asesories')
export class AreasAsesories {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @OneToMany(() => QuestionsBeneficiaries, (question) => question.areaAsesory)
    questions: QuestionsBeneficiaries[];

    @OneToMany(() => ResponsesBeneficiaries, (responseBeneficiary) => responseBeneficiary.areaAsesory)
    responseBeneficiary: ResponsesBeneficiaries[];

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
    deletedAt: Date;
}
