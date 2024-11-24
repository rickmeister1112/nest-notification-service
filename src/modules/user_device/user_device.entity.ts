import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserDevice {
  @Field()
  userId: string;

  @Field()
  deviceId: string;
}
