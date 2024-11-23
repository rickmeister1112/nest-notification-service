import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity('vendor')
export class VendorEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  vendor_id: string;

  @Field()
  @Column()
  vendor_name: string;

  @Field()
  @Column()
  vendor_type: string; // e.g., SMS provider or email provider

  @Field()
  @Column()
  webhook_url: string;

  @Field()
  @Column()
  no_of_request_per_sec: number;

  @Field()
  @Column({ default: 0 })
  failed_request_count: number;
}
