import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
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
  @Column()
  status: string;
  @Column()
  receiptUrl: string;
  @Column({ type: 'boolean', name: 'is_anonymous', default: false })
  isAnonymous: boolean;
}
