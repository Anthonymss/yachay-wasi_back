import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Beneficiary } from "./beneficiary.entity";
export enum PREFERED_COURSES {
    MATEMATICA = 'Matemática',
    COMUNICACION = 'Comunicación',
    INGLES = 'Inglés',
    CIENCIAS_SOCIALES = 'Ciencias Sociales',
    RELIGION = 'Religión',
    OTROS = 'Otros',
}
@Entity('beneficiary_preferred_courses')
export class BeneficiaryPreferredCourses {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'enum', enum: PREFERED_COURSES, nullable: false })
    name: PREFERED_COURSES;
    @Column({ type: 'varchar', length: 100, nullable: true })
    customCourseName?: string;
    @ManyToOne(() => Beneficiary, (beneficiary) => beneficiary.beneficiaryPreferredCourses)
    @JoinColumn({ name: 'beneficiary_id' })
    beneficiary: Beneficiary;
    
}
