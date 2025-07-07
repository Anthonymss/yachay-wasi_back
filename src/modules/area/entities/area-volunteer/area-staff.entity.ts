import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubAreas } from './sub-area.entity';

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

  //Le decimos al padre quienes son sus hijos
  @OneToMany(() => SubAreas, (subArea) => subArea.areaStaff, {
    cascade: true, // Opcional: si eliminas un Área, también se eliminan sus sub-áreas.
    eager: false,  // Mantenlo en false para no cargar siempre las sub-áreas, solo cuando lo pides con 'relations'.
  })
  subAreas: SubAreas[];
}
