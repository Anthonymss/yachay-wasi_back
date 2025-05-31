import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'roles' })
export class Rol {
  @PrimaryColumn()
  id: number;
  @Column()
  name: string;
  @Column({ type: 'text', nullable: true })
  description: string;
}
