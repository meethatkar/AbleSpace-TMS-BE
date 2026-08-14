import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class Task {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  status: string;

  @Prop({ type: Types.ObjectId, required: true, ref: User.name })
  reporter: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  members: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: User.name }) //todo: Teams model
  teams: Types.ObjectId;

  @Prop()
  dueDate: string;

  @Prop()
  priority: string;

  @Prop({ type: [String] })
  labels: string[];

  @Prop()
  updates: string;

  @Prop({ type: Types.ObjectId, ref: User.name })
  updatedBy: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
