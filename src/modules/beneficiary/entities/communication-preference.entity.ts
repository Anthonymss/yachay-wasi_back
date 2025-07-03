import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { Beneficiary } from "./beneficiary.entity";



@Entity('communication_preference')
export class CommunicationPreference {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({type: 'varchar', length: 100})
    name: string;
    @ManyToMany(() => Beneficiary, (beneficiary) => beneficiary.communicationPreferences)
    @JoinTable({
        name: 'beneficiary_communication_preference',
        joinColumn: { name: 'communication_preference_id' },
        inverseJoinColumn: { name: 'beneficiary_id' },
    })
    beneficiaries: Beneficiary[];
}
