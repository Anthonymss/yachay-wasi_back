import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('area_staff')
export class AreaStaff {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;
  @Column({ type: 'boolean', name: 'is_active', nullable: true })
  isActive: boolean;
}
