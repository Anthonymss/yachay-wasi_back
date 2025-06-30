import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubAreas } from './sub-areas.entity';

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

  @Column({ type: 'varchar', length: 255, nullable: true })
  volunteerTime: string; // tiempo de voluntariado

  // Le decimos al padre quienes son sus hijos
  @OneToMany(() => SubAreas, (subArea) => subArea.areaStaff, {
    cascade: true, // Opcional: si eliminas un Área, también se eliminan sus sub-áreas.
    eager: false,  // Mantenlo en false para no cargar siempre las sub-áreas, solo cuando lo pides con 'relations'.
  })
  subAreas: SubAreas[];

}
