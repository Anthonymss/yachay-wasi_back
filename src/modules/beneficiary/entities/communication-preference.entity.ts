import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { Beneficiary } from "./beneficiary.entity";

export enum COMMUNICATION_PREFERENCE {
    CALL = 'Llamada',
    VIDEO_CALL = 'Llamada y WhatsApp',
    WHATSAPP_VIDEO = 'Solo WhatsApp (incluye videollamadas)',
    VIRTUAL_PLATFORM = 'Plataformas virtuales (meet, zoom, teams)',
    TEXT = 'Mensaje de texto y WhatsApp',
}

@Entity('communication_preference')
export class CommunicationPreference {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'enum', enum: COMMUNICATION_PREFERENCE, nullable: false })
    name: COMMUNICATION_PREFERENCE;
    @ManyToMany(() => Beneficiary, (beneficiary) => beneficiary.communicationPreferences)
    @JoinTable({
        name: 'beneficiary_communication_preference',
        joinColumn: { name: 'communication_preference_id' },
        inverseJoinColumn: { name: 'beneficiary_id' },
    })
    beneficiaries: Beneficiary[];
}
