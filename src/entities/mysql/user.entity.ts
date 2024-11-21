import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({ default: true })
  pushNotificationEnabled: boolean;

  @Column({ default: true })
  emailEnabled: boolean;

  @Column({ default: true })
  smsEnabled: boolean;

  @Column({ default: false })
  isBlacklisted: boolean;
}
