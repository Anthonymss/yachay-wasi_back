import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('areas_staff')
export class AreasStaff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;
  
  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;
}
