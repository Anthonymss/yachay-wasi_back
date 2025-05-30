import {
  Column,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'roles' })
export class Rol {
  @PrimaryColumn()
  id: number;
  @Column()
  name: string;
  @Column({ type: 'text', nullable: true })
  description: string;
}
