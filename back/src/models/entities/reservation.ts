import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Generated,
  UpdateDateColumn
} from 'typeorm'
import { Discipline } from '../../services/nordkraft.service'

@Entity({ name: 'reservations' })
export class Reservation {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'uuid' })
  @Generated('uuid')
  uuid: string

  @Column({ name: 'location' })
  location: string

  @Column({ name: 'discipline' })
  discipline: Discipline

  @Column({ name: 'start_time', type: 'timestamp with time zone' })
  startTime: Date

  @Column({ name: 'end_time', type: 'timestamp with time zone' })
  endTime: Date

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', nullable: false })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', nullable: false })
  updatedAt: Date
}