import { Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import { Beneficiary } from 'src/modules/beneficiary/entities/beneficiary.entity';
@Entity('areas_asesories')
export class AreaAdviser {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;
  @Column({ type: 'boolean', name: 'is_active', nullable: true })
  isActive: boolean;
  @Column()
  description: string;
  //other relations
  @ManyToMany(() => Beneficiary, (beneficiary) => beneficiary.areaAdvisers)
  @JoinTable({
    name: 'beneficiary_area_adviser',
    joinColumn: { name: 'area_adviser_id' },
    inverseJoinColumn: { name: 'beneficiary_id' },
  })
  beneficiaries: Beneficiary[];

}
