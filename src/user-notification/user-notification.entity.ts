import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('user_notification_mysql')
export class UserNotificationMysql {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string; // UUID for the id

  @Field()
  @Column({ type: 'uuid', unique: true })
  userId: string; // UUID for userId

  @Field()
  @Column({ default: true })
  pushNotificationEnabled: boolean;

  @Field()
  @Column({ default: true })
  emailEnabled: boolean;

  @Field()
  @Column({ default: true })
  smsEnabled: boolean;

  @Field()
  @Column({ default: false })
  isBlacklisted: boolean;
}
