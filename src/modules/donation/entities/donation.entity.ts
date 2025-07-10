import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('donations')
export class Donation {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;
  @Column({ type: 'varchar', length: 100, nullable: false })
  email: string;
  @Column()
  amount: number;
  @Column()
  currency: string;
  @Column()
  donationType: string;
  @Column()
  paymentMethod: string;
  @CreateDateColumn({ type: 'timestamp', name: 'date' })
  date: Date;
  @Column({ type: 'varchar', length: 500, nullable: true })
  message: string;
  @Column({ type: 'enum', enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'], default: 'PENDING' })
  status: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  receiptUrl?: string;
  @Column({ type: 'boolean', name: 'is_anonymous', default: false })
  isAnonymous: boolean;
  @Column({ nullable: true })
  paypalOrderId?: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;

}
