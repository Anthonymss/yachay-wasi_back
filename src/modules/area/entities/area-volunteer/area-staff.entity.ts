import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubArea } from './sub-area.entity';
@Entity('areas_staff')
export class AreaStaff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string;
  @OneToMany(() => SubArea, (subArea) => subArea.areaStaff, {
    cascade: true,
    eager: false,
  })
  subAreas: SubArea[];
}
