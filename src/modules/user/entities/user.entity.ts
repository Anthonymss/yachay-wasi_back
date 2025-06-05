import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rol } from './rol.entity';
import { Beneficiary } from 'src/modules/beneficiary/entities/beneficiary.entity';
import { SubArea } from 'src/modules/area/entities/area-volunteer/sub-area.entity';
import { RefreshToken } from './refresh-token.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;
  @Column({ type: 'varchar', length: 100, nullable: true, name: 'last_name' })
  lastName: string;
  @Column({ type: 'varchar', length: 15, nullable: true, name: 'phone_number' })
  phoneNumber: string;
  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  email: string;
  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;
  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt: Date;

  //relations1
  @OneToMany(() => Beneficiary, (beneficiary) => beneficiary.user)
  beneficiaries: Beneficiary[];
  @ManyToOne(() => SubArea, (subArea) => subArea.user)
  @JoinColumn({ name: 'sub_area_id' })
  subArea: SubArea;
  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
  })
  refreshTokens: RefreshToken[];
}
